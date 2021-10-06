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
        });

    
        this.objects = []
        this.obstacles = []
        this.stars = []
        this.physics = new Physics(this.app.view)
        const self = this

        this.physics.click(function(body) {
           // move the camera
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

        // create level
        let s = 42
        let cols = 6
        let rows = 9
        let towerX = w * .68
        let y = 0


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
        this.arrow.scale.set(.15)
        this.arrow.alpha = 0
        this.arrow.rotation = Math.PI * .75
        

      gsap.to(this.arrow.position, .7, {x: '-=25', y: '+=18', yoyo: true, repeat: -1, ease: 'power2.inOut'})
      gsap.to(this.arrow, {alpha: .5, yoyo: true, repeat: 1, repeatDelay: .7 * 5})

       this.scene.addChild(this.arrow)


       // win
       this.instruction = new PIXI.Text('PULL AND RELEASE TO SHOT',{fontFamily : 'Arial Black', fontSize: 16, fill : 0x7FBAA9, align : 'center'})
       this.mainText = new PIXI.Text('HIT ALL 3 YELLOW BALLS OR MAKE THEM FALL ON THE GROUND',{fontFamily : 'Arial Black', fontSize: 25, fill : 0x7FBAA9, align : 'center'})
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
       this.app.stage.addChild(this.instruction)
       this.app.stage.addChild(this.winText)


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

        // tower, 1st floor
        for (let i = 0; i <= (rows * cols); i++) {

            i === Math.ceil(rows / 2 * cols / 2) || i === Math.ceil(rows / 1.4 * cols / 1.4)

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
        rows = 4
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
                        if (Math.abs((p1.x - p2.x) / distance * 1e8)) {
                            o.body.ApplyImpulse({x: Math.abs((p1.x - p2.x) / distance * 1e7), y: Math.abs((p1.y - p2.y) / distance * 1e7)}, o.body.GetWorldCenter())
                        }
                    })
                    this.disabled = true
                    this.body.m_world.DestroyBody(this.body);
                    gsap.to(this.shape, .5, {alpha: 0})
                    self.scoreText.text = `SCORE: ${++self.score}`
                    gsap.to(self.scoreText.scale, .25, {x: 1.2, y: 1.2, yoyo: true, repeat: 1})
                    if (self.score === 3) {
                        gsap.to(self.winText, 1, {alpha: 1, ease: 'back'})
                    }
                }
                    
            }
        })


        // create ball
        setTimeout(() => this.spawnBall(), 200)

        // create ball stick
        game.add(game.rect('static', {color: 0x777777, x: w * .2, y: h * .95, width: 1, height: 200}))
        // append canvas to the container
        document.body.appendChild(this.app.view);
        this.resize()
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
            this.line.zIndex = 0
        }
        const p1 = {x: this.sizes.width * .2, y: this.sizes.height * .85}
        const p2 = {x: this.ball?.body.GetPosition().x, y: this.ball?.body.GetPosition().y}
        const d = this.distance(p1,p2)
        this.line.lineStyle(10 - (d * .026), 0xffee33 - d)
                .moveTo(p1.x, p1.y)
                .lineTo(p2.x, p2.y);

        
    },
    rect: function(type, {color, x, y, height, width}) {
        const shape = new PIXI.Graphics();
        if (color) shape.beginFill(0xddddff >> color * .65);
        shape.lineStyle({ color: 0xffffff, width: 1, alignment: 0 });
        shape.position.x = x + (width/2);
        shape.position.y = y + (height/2);
        shape.drawRect(-(width/2), -(height/2), width, height);
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
        this.ball = game.add(game.circle('dynamic', {color: 0xff4400, x: w * .2, y: h * .5, radius: 25, density: 50, friction: 0, restitution: 0.6}))
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
    resize: function() {
            let w,h;
            if (window.innerWidth / window.innerHeight >= this.ratio) {
                w = window.innerHeight * this.ratio;
                h = window.innerHeight;
            } else {
                w = window.innerWidth;
                h = window.innerWidth / this.ratio;
            }
            this.app.view.style.width = w + 'px';
            this.app.view.style.height = h + 'px';
        window.onresize = () => this.resize();
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
            if (this.ball?.body.GetPosition().x < -100 || (this.ball?.body.GetPosition().x > this.sizes.width * .21 && this.ball?.body.GetLinearVelocity().x + this.ball?.body.GetLinearVelocity().y === 0)) this.spawnBall()
        })

        
    }
}

