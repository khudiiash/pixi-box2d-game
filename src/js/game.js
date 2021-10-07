import Physics from "./physics.js";

function getDistance(p1, p2) {
    // returns distance between points  number
    // points in format {x: number, y: number}
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
  } 

export const game = {
    init: function({bounded}) {
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        this.ratio = this.sizes.width / this.sizes.height
        this.app = new PIXI.Application({
            width: this.sizes.width,
            height: this.sizes.height,
            antialias: true,
            transparent: false, 
            backgroundColor: 0x111111,
            resolution: Math.min(window.devicePixelRatio, 2),
            autoDensity: true,
        })
        this.mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(navigator.userAgent||navigator.vendor||window.opera)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent||navigator.vendor||window.opera).substr(0,4))


    
        this.objects = []
        this.obstacles = []
        this.stars = []
        this.physics = new Physics(this.app.view)
        const self = this

        this.physics.click(function(body) {
           // move the camera
           if (body !== self.ball.body) return
           setTimeout(() => {
               if (body === self.ball.body && body.GetPosition().x > self.sizes.width * .2) 
               gsap.to(self.scene.position, 1, {
                   x: -w / 3, 
                   ease: 'power1.inOut', 
                   delay: .5, 
                   yoyo: true, 
                   repeat: 1, 
                   repeatDelay: 1, 
                   onComplete: () => self.spawnBall.apply(self)})
           }, 300)
        });
        const {width: w, height: h} = this.sizes
        this.scene = new PIXI.Container()
        this.godrays = new PIXI.Container()
        this.scene.width = w
        this.scene.height = h
        this.scene.pivot.x = this.scene.width / 2;
        this.scene.pivot.y = this.scene.height / 2;
        this.app.stage.addChild(this.scene)
        this.godraysFilter = new PIXI.filters.GodrayFilter({time: 0, gain: .2, alpha: .8, lacunarity: 4})
        this.scene.filters = [ this.godraysFilter, new PIXI.filters.AdvancedBloomFilter({bloomScale: .5})]

        for (let i = 0; i < 300; i++) {
            this.stars.push(game.add(game.star({color: 0xffffff << i * .01, x: Math.random() * this.sizes.width * 2, y: Math.random() * 300, radius: Math.random()})))
        }
        

        if (bounded) {
            // create walls
            //game.add(game.rect('static', { x: w / 2, y: 0, height: 10,  width: w})) // top
            //game.add(game.rect('static', { x:  w - 5, y: h / 2, height: h,  width: 10})) // right
            this.floor = game.add(game.rect('static', { color: 25, x: w, y: h - 5, height: 10,  width: w * 2})) // bottom
            //game.add(game.rect('static', { x: 0, y: h / 2, height: h, width: 10})) // left
        }

 


       // score
       this.score = 0
       this.scoreText = new PIXI.Text('SCORE: 0',{fontFamily : 'Arial Black', fontSize: 25, fill : 0x7FBAA9, align : 'center'});
    
       this.scoreText.pivot.x = this.scoreText.width / 2
       this.scoreText.pivot.y = this.scoreText.height / 2

       this.scoreText.position.x = 25 + this.scoreText.width / 2
       this.scoreText.position.y = 25 + this.scoreText.height / 2
    
       this.app.stage.addChild(this.scoreText)


       // arrow

       this.arrow = new PIXI.Sprite.from('../img/white-arrow.png')


        this.arrow.pivot.set(250,250)
        this.arrow.position.x = w * .15
        this.arrow.position.y = h * .9
        this.arrow.scale.set(.13)
        this.arrow.alpha = 0
        this.arrow.rotation = Math.PI * .8
        

       gsap.to(this.arrow.position, .7, {x: '-=25', y: '+=18', yoyo: true, repeat: -1, ease: 'power2.inOut'})
       gsap.to(this.arrow, {alpha: .5, yoyo: true, repeat: 1, repeatDelay: .7 * 5})

       this.scene.addChild(this.arrow)


       // win
       this.instruction = new PIXI.Text('PULL AND RELEASE TO SHOOT',{fontFamily : 'Arial Black', fontSize: 16, fill : 0x7FBAA9, align : 'center'})
       this.mainText = new PIXI.Text('HIT ALL 3 YELLOW BALLS\nOR MAKE THEM FALL\nON THE GROUND',{fontFamily : 'Arial Black', fontSize: 25, fill : 0x7FBAA9, align : 'center'})
       this.winText = new PIXI.Text('WIN',{fontFamily : 'Arial Black', fontSize: 50, fill : 0x7FBAA9, align : 'center'})
    
       this.mainText.pivot.x = this.mainText.width / 2
       this.mainText.pivot.y = this.mainText.height / 2
       this.winText.pivot.x = this.winText.width / 2
       this.winText.pivot.y = this.winText.height / 2

       this.mainText.position.x = this.winText.position.x = this.sizes.width / 2
       this.mainText.position.y = this.winText.position.y = this.sizes.height / 2 - 200
       this.instruction.position.x = 10
       this.instruction.position.y = h * .96
       this.mainText.alpha = this.instruction.alpha = this.winText.alpha = 0
       gsap.to([this.mainText, this.instruction], .5, {alpha: 1, delay: 1, yoyo: true, repeat: 1, repeatDelay: 2.5})
       this.app.stage.addChild(this.mainText)
       this.scene.addChild(this.instruction)
       this.app.stage.addChild(this.winText)



    const graphics1 = this.star({x: 0, y: 0, color: 0xffff00, radius: 5}).shape
    const graphics2 = this.star({x: 0, y: 0, color: 0xaaaaff, radius: 5}).shape
    const graphics3 = this.star({x: 0, y: 0, color: 0x0000ff, radius: 10}).shape
    const texture1 = this.app.renderer.generateTexture(graphics1)
    const texture2 = this.app.renderer.generateTexture(graphics2)
    const texture3 = this.app.renderer.generateTexture(graphics3)
    this.explosion = new PIXI.Container()
    this.explosion.x = w * .2
    this.explosion.y = h * .8
    this.explosion.width = 200
    this.explosion.height = 200

    //this.explosion.addChild(this.rect('static', {color: 25, x: 0, y: 0, width: 100, height: 100}).shape)

    this.emitter = new PIXI.particles.Emitter(

	// The PIXI.Container to put the emitter in
	// if using blend modes, it's important to put this
	// on top of a bitmap, and not use the root stage Container
	this.explosion,

	// The collection of particle images to use
	[texture1, texture2, texture3],

        // Emitter configuration, edit this to change the look
        // of the emitter
        {
            "alpha": {
                "start": 1,
                "end": 0
            },
            "scale": {
                "start": 4,
                "end": 0,
                "minimumScaleMultiplier":0
            },
            "color": {
                "start": "#ffcd70",
                "end": "#ff3d3d"
            },
            "speed": {
                "start": 300,
                "end": 800,
                "minimumSpeedMultiplier": 2
            },
            "acceleration": {
                "x": 0,
                "y": 0
            },
            "maxSpeed": 0,
            "startRotation": {
                "min": 15,
                "max": 360
            },
            "noRotation": false,
            "rotationSpeed": {
                "min": 0,
                "max": 350
            },
            "lifetime": {
                "min": 0.2,
                "max": 0.8
            },
            "blendMode": "normal",
            "frequency": 0.00001,
            "emitterLifetime": 0.5,
            "maxParticles": 300,
            "pos": {
                "x": 0,
                "y": 0
            },
            "addAtBack": false,
            "spawnType": "ring",
            "spawnCircle": {
                "x": 0,
                "y": 0,
                "r": 0,
                "minR": 0
            }
        }
    )

        // Start emitting
        this.emitter.emit = false

        this.scene.addChild(this.explosion)

       // obstacles
       for (let i = 0; i < 4; i++) {
            
            this.obstacles.push(
                game.add(game.rect('kinematic', { 
                    color: 0xffffff,
                    x: w * .4 + (400 * i),
                    y: h / 2 + ((Math.random() - .5) * h / 2),
                    width: 10,
                    height: h / 4
                })))
       }
        // create level
        // tower, 1st floor
        let s = 42
        let cols = 6
        let rows = 9
        let towerX = w * .68
        let y = 0

        if (this.mobile) {
            s = 35
            cols = 6
            rows = 9
            towerX = w * .75
            y = 0

        }
        for (let i = 0; i <= (rows * cols); i++) {

            i === Math.ceil(rows / 1.9 * cols / 1.9) || i === Math.ceil(rows / 1.2 * cols / 1.2)

            ? game.add(game.circle('dynamic', { 
                x: towerX + s * (i  % cols),
                y: h - s * (i % cols ? y : y++),
                radius: s / 2,
                isTarget: true 
            }))
            : game.add(game.rect('dynamic', { 
                color: Math.floor(31 - i / 5) - 1,
                x: towerX + s * (i % cols),
                y: h - s * (i % cols ? y : y++),
                width: s,
                height: s,
            }))
        }
        // second floor
        rows = this.mobile ? 2 : 4
        cols = 4
        towerX += 50

        for (let i = 0; i <= (rows * cols); i++) {

            i === Math.floor(rows / 2.5 * cols / 2.5) ?

            game.add(game.circle('dynamic', { 
                x: towerX + s * (i  % cols),
                y: h - s * (i % cols ? y : y++),
                radius: s / 2,
                isTarget: true 
            }))
            : game.add(game.rect('dynamic', { 
                color: Math.floor(31 - i / 5) - 1,
                x: towerX + s * (i % cols),
                y: h - s * (i % cols ? y : y++),
                width: s,
                height: s,
            }))
        }


        this.objects.filter(o => o.isTarget).forEach(target => {
            target.contact = function(contact, impulse, first) {
                const contactBody = first ? contact.GetFixtureB().GetBody().GetUserData() : contact.GetFixtureA().GetBody().GetUserData();
                if (contactBody.body === self.ball?.body || contactBody.body === self.floor.body) {
                    if (this.disabled) return
                    self.objects.forEach((o,i) => {
                        const p1 = this.body.GetPosition()
                        const p2 = o.body.GetPosition()
                        const distance = getDistance(p1,p2)
                        if ((p1.x - p2.x) / distance * -1e5) {
                            o.body.ApplyImpulse({x: (p1.x - p2.x) / distance * -1e5 * 3, y: (p1.y - p2.y) / distance * -1e5 * 3}, o.body.GetWorldCenter())
                        }
                    })
                    this.disabled = true
                    this.body.m_world.DestroyBody(this.body);
                    gsap.to(this.shape, .5, {alpha: 0})
                    self.scoreText.text = `SCORE: ${++self.score}`
                    gsap.to(self.scoreText.scale, .25, {x: 1.2, y: 1.2, yoyo: true, repeat: 1})

                    self.explosion.position.x = this.shape.position.x
                    self.explosion.position.y = this.shape.position.y
                    self.emitter.emit = true
                    if (self.score === 3) {
                        gsap.to(self.winText, 1, {alpha: 1, ease: 'back'})
                    }
                }
                    
            }
        })


        // create ball
        setTimeout(() => this.spawnBall(), 200)

        // create ball stick
        this.stick = game.add(game.rect('static', {color: 0x00ffdd, x: w * .2, y: h * .95, width: 1, height: 200}))
        // append canvas to the container
        document.body.appendChild(this.app.view);

        // resize handling
        window.onresize = () => {
            this.app.renderer.resize(window.innerWidth,window.innerHeight)
        }
    },
    add: function(obj) {
        this.scene.addChild(obj.shape)
        return obj
    },
    distance: function(p1,p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
    },
    drawLine: function() {
        if (this.line) {
            this.line.clear()
        } else {
            this.line = new PIXI.Graphics()
            this.scene.addChild(this.line)
        }
        const factor = this.mobile ? 9 : 10
        const p1 = {x: this.stick.shape.x, y: this.stick.shape.y - this.stick.shape.height / 2}
        const p2 = {x: this.ball?.body.GetPosition().x, y: this.ball?.body.GetPosition().y}
        const d = this.distance(p1,p2)
        if (factor - (d * .026) < 1 && this.ball) this.ball.away = true;
        this.ball && !this.ball.away && this.line.lineStyle(factor - (d * .026), 0xffee33 - d)
                .moveTo(p1.x, p1.y)
                .lineTo(p2.x, p2.y);

        
    },
    rect: function(type, {color, x, y, height, width}) {
        const shape = new PIXI.Graphics();
        if (color) shape.beginFill(0xddddff >> color * .65);
        shape.lineStyle({ color: 0xffffff, width: 1, alignment: 0 });
        shape.position.x = x + (width/2);
        shape.position.y = y + (height/2);
        shape.drawRoundedRect(-(width/2), -(height/2), width, height, 5);
        const body = this.physics.add({ type, x, y, height, width })
        body.shape = shape        
        this.objects.push(body)
        return body
    },
    circle: function(type, details) {
            const {color, x, y, radius} = details
            const shape = new PIXI.Graphics();
            shape.beginFill( color || 0xffee66);
            shape.lineStyle({ width: 1, alignment: 0 });
            shape.position.x = x;
            shape.position.y = y;
            shape.drawCircle(0, 0, radius);
            const body = this.physics.add({...details, type, radius, shape: 'circle'})
            body.shape = shape
            this.objects.push(body)
            return body
    },
    spawnBall() {
        const {width: w, height: h} = this.sizes 
        if (this.ball && Math.abs(this.ball.body.GetPosition().x - w * .2) < 5 || this.score === 3) return;
        gsap.to(this.ball?.shape, 1, {alpha: .2})
        this.ball = game.add(game.circle('dynamic', {color: 0xff4400, x: w * .2, y: h * .5, radius: this.mobile ? 18 : 25, density: 50, friction: 0, restitution: 0.6, ball: true}))
        gsap.from(this.ball.shape, .5, {alpha: 0})
    },
    star: function(details) {
        const {color, x, y, radius} = details
        const shape = new PIXI.Graphics();
        shape.beginFill( color || 0xffffff);
        shape.lineStyle({ width: 1, alignment: 0 });
        shape.position.x = x;
        shape.position.y = y;
        shape.drawCircle(0, 0, radius);
        return {shape}
    },
    render: function() {
        let elapsed = 0
        const now = Date.now()
        this.app.ticker.add(delta => {
            elapsed += delta           
            for (const object of this.objects) {
                const i = this.objects.indexOf(object)
                object.shape.x = object.body.GetPosition().x
                object.shape.y = object.body.GetPosition().y
                object.shape.rotation = object.body.GetAngle()
                this.obstacles[i] ? this.obstacles[i].body.SetLinearVelocity({x: 0, y: Math.sin(elapsed * (i + 1) * .01) * 10}) : 0
            }

            for (let i = 0; i < this.stars.length; i++) {
                this.stars[i].shape.alpha = Math.sin(elapsed * (i + 1) * .0001)
            }          
            this.godraysFilter.time = elapsed * .015

            this.physics.step(delta)
            this.drawLine()
            this.emitter.update(delta * 0.01)

            if (this.ball?.body.GetPosition().x < -100 || (this.ball?.body.GetPosition().x > this.sizes.width * .21 && this.ball?.body.GetLinearVelocity().x + this.ball?.body.GetLinearVelocity().y === 0)) this.spawnBall()
        })

        
    }
}



