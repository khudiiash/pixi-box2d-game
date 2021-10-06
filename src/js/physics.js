import Box2D from "./lib/box2d.js";

const b2Vec2 = Box2D.Common.Math.b2Vec2
const {b2BodyDef, b2Body, b2FixtureDef, b2Fixture, b2World, b2DebugDraw} = Box2D.Dynamics
const {b2MassData, b2PolygonShape, b2CircleShape} = Box2D.Collision.Shapes
class Body {
    constructor(physics, details) {

        this.details = details = details || {};
        // Create the definition
        this.definition = new b2BodyDef();
        this.isTarget = details.isTarget
        const bodyType = ['static', 'kinematic', 'dynamic']

        // Set up the definition
        for (var k in this.definitionDefaults) {
            this.definition[k] = details[k] || this.definitionDefaults[k];
        }
        this.definition.position = new b2Vec2(details.x || 0, details.y || 0);
        this.definition.linearVelocity = new b2Vec2(details.vx || 0, details.vy || 0);
        this.definition.userData = this;
        this.definition.type = bodyType.indexOf(details.type)
        // Create the Body
        this.body = physics.world.CreateBody(this.definition);



        // Create the fixture
        this.fixtureDef = new b2FixtureDef();
        for (var l in this.fixtureDefaults) {
            this.fixtureDef[l] = details[l] || this.fixtureDefaults[l];
        }
        details.shape = details.shape || this.defaults.shape;

        switch (details.shape) {
            case "circle":
                details.radius = details.radius || this.defaults.radius;
                this.fixtureDef.shape = new b2CircleShape(details.radius);
                break;
            case "polygon":
                this.fixtureDef.shape = new b2PolygonShape();
                this.fixtureDef.shape.SetAsArray(details.points, details.points.length);
                break;
            case "block":
            default:
                details.width = details.width || this.defaults.width;
                details.height = details.height || this.defaults.height;

                this.fixtureDef.shape = new b2PolygonShape();
                this.fixtureDef.shape.SetAsBox(details.width / 2,
                details.height / 2);
                break;
        }
        this.body.CreateFixture(this.fixtureDef);
    }
    setPower(power) {
        this.body.m_userData.power = power
    }
}
Body.prototype.defaults = {
    shape: "block",
    width: 5,
    height: 5,
    radius: 2.5
};

Body.prototype.fixtureDefaults = {
    density: 2,
    friction: 1,
    restitution: 0.2
};

Body.prototype.definitionDefaults = {
    active: true,
    allowSleep: true,
    angle: 0,
    angularVelocity: 0,
    awake: true,
    bullet: false,
    fixedRotation: false
};

export default class Physics {
    constructor(element) {
        const gravity = new b2Vec2(0,9.8);
        this.world = new b2World(gravity, true);
        this.scale = 1;
        this.dtRemaining = 0;
        this.stepAmount = 1/60;
        this.element = element
        this.bodies = []
        this.fire = {}
        this.collision()
        this.dragNDrop()

    }
    add(details) {
        const body = new Body(this, details)
        this.bodies.push(body)
        return body
    }
    click(callback) {
        const self = this;      
        function handleClick(e) {
            e.preventDefault();
            const point = {
            x: (e.offsetX || e.layerX || e.changedTouches[0].clientX) / self.scale,
            y: (e.offsetY || e.layerY || e.changedTouches[0].clientY) / self.scale
          };
            self.world.QueryPoint(function(fixture) {
        callback(fixture.GetBody(),
           fixture,
           point);
            }, point);
          }

        this.element.addEventListener("mouseup",handleClick);
        this.element.addEventListener("touchend",handleClick);
    }
    dragNDrop() {
        const self = this;
        let obj = null,
            joint = null,
            startVec = {x: 0, y: 0}
    
        function calculateWorldPosition(e) {
            return {
                x: (e.offsetX || e.layerX) / self.scale,
                y: (e.offsetY || e.layerY) / self.scale
            };
        }

        function start(e) {
            e.preventDefault();
            const point = calculateWorldPosition(e);
            if (!point.x || !point.y) {
                point.x = e.touches[0]?.clientX 
                point.y = e.touches[0]?.clientY
            }
            startVec = point
            self.world.QueryPoint(function (fixture) {
                obj = fixture.GetBody().GetUserData();
            }, point);
        }
        function move(e) {
                if (!obj) return
                const point = calculateWorldPosition(e);
                if (!point.x || !point.y) {
                    point.x = e.touches[0]?.clientX 
                    point.y = e.touches[0]?.clientY
                }
                if (!joint) {
                    const jointDefinition = new Box2D.Dynamics.Joints.b2MouseJointDef();
        
                    jointDefinition.bodyA = self.world.GetGroundBody();
                    jointDefinition.bodyB = obj.body;
                    jointDefinition.target.Set(point.x, point.y);
                    jointDefinition.maxForce = 1e28;
                    jointDefinition.timeStep = self.stepAmount;
                    joint = self.world.CreateJoint(jointDefinition);
                }
        
                joint.SetTarget(new b2Vec2(point.x, point.y));
        }

        function end(e) {

            const point = calculateWorldPosition(e);
            if (!point.x || !point.y) {
                point.x = e.changedTouches[0]?.clientX 
                point.y = e.changedTouches[0]?.clientY
            }
            const power = {x: (startVec.x - point.x) * 2, y: (startVec.y - point.y) * 6}
            // Shot
            if (!obj) return
            obj.body.ApplyImpulse({ x: 1e8 * power.x, y: 1e8 * power.y}, obj.body.GetWorldCenter());
            obj = null
            if (joint) {
                self.world.DestroyJoint(joint);
                joint = null;
            }         
        }
    
        this.element.addEventListener("mousedown", start);
        this.element.addEventListener("touchstart", start);
    
        this.element.addEventListener("mousemove", move);
        this.element.addEventListener("touchmove", move);
    
        this.element.addEventListener("mouseup", end);
        this.element.addEventListener("touchend", end);
    
    }
    collision() {
        this.listener = new Box2D.Dynamics.b2ContactListener();
        this.listener.PostSolve = function (contact, impulse) {
            const bodyA = contact.GetFixtureA().GetBody().GetUserData(),
                  bodyB = contact.GetFixtureB().GetBody().GetUserData();
            if (bodyA.contact) {
                bodyA.contact(contact, impulse, true)
            }
            if (bodyB.contact) {
                bodyB.contact(contact, impulse, false)
            }
        };
        this.world.SetContactListener(this.listener);
    };
    step(dt) {
        this.dtRemaining += dt * .3;
        while (this.dtRemaining > this.stepAmount) {
            this.dtRemaining -= this.stepAmount;
            this.world.Step(this.stepAmount,
            8, // velocity iterations
            3); // position iterations
        }
    }
};