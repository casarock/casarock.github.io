/*!
 * DropSomething
 * #GBJAM 3 entry. Inverse Doodle Jump.
 * http://appsbu.de
 * @author Carsten Sandtner
 * @version 1.0.0
 * Copyright 2014. MIT licensed.
 */

window.DropSomething={},DropSomething.Boot=function(a){this.game=a},DropSomething.Boot.prototype={preload:function(){var a="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATgAAAAICAYAAABtcuNzAAACVElEQVRoQ+2ZMXJDMQhE4y5HSOn7nypljpAumV8oQxjBW8Dfhee7syUELMsKJbe363MhcCFwIfCiCNx8Xu8f95/vr8/t72tvd31nt848/NpYqj4q9lEc64wz1m18dP6Bg99D9pQ/rR8+Mx+WFxlHlNyi/Jbt7vzI54rb+iV74niVe57DU3uq/xQ/nz999xh38FX4Rxqb9WfE3X9CRg1uC0litWvQ47dOc+xInIHRLYDaYGefv8uNBCYTAAW/in23hhl/JvlZ3kYc9nsifkZYVeKb8qPK7akAPUPgbE7EtSj/jj79CdxyqjinPVmBu81BPgnAZxL0DIJX4ieBnK53a6gIXOdsz90I/zX5TOtztv0rCxz1cbZOArdbl5+oyvSWBbDWomeuXe+O+DSpqAB1nwCWmJ0npjoVZw28i52enxY3moCi+hH2ygUUxU5nqwK3XhDT+kb8pBdAhp2tkcqDCNOqACv4KfEpPZzllgk76U8kjCWBI/WlIIioyg1PZygTAOVRJYiPaWpPExadT/a0TucrGFenEN9k3p5udvVvcJmAk0CpwpPhR9w7i98ZvorA2bgphwk/umdHl7gscOSYbmhF/KYCpzYB5dJpcCJAZX0qQGRP6538qTGJHxN8fLyd+Cf+be5dASV8qH/U+BXx7eBH8VPPKdNbZ09J4KyD6hNMKdDaQ/+Jy9bplj180Jic3UCRvUIwNb+dj9U4mX+qj5J3FCPlRwKnxE8TVJTfIwTOTgD0BI0azebo60T4ET7UPxR/Vh8ryl2BpvgzbCrCRUOMx/0XnyncVMonngcAAAAASUVORK5CYII=";this.game.load.image("font",a)},create:function(){var a=document.getElementById("pixel");this.game.CS.settings.pixelcontext=a.getContext("2d"),this.game.CS.settings.pixelwidth=a.width,this.game.CS.settings.pixelheight=a.height,this.game.CS.audio={},this.game.CS.highscore=0,Phaser.Canvas.setSmoothingEnabled(this.game.CS.settings.pixelcontext,!1),this.game.input.maxPointers=1,this.game.stage.disableVisibilityChange=!0,this.game.state.start("Preloader")},render:function(){this.game.CS.settings.pixelcontext.drawImage(this.game.canvas,0,0,this.game.CS.settings.originWidth,this.game.CS.settings.originHeight,0,0,this.game.CS.settings.pixelwidth,this.game.CS.settings.pixelheight)}},DropSomething.Game=function(a){this.game=a,this.platformTimer=null},DropSomething.Game.prototype={create:function(){this.game.stage.backgroundColor="#E0F8D0",this.dead=!1,this.game.physics.startSystem(Phaser.Physics.ARCADE),this.initialVelocity=this.levelVelocity=-25,this.platformCounter=0,this.game.CS.score=0,this.endModalBmp=this.game.add.bitmapData(160,144),this.endModalBmp.context.lineWidth=2,this.endModalBmp.context.fillStyle="rgba(136, 192, 112, 1)",this.modalLayer=this.game.add.sprite(0,0,this.endModalBmp),this.ball=this.add.sprite(this.game.world.width/2,32,"sprites","ball"),this.platform1=this.game.add.group(),this.platform2=this.game.add.group(),this.extra=this.game.add.group(),this.platform1.createMultiple(30,"sprites","ground1"),this.platform2.createMultiple(30,"sprites","ground2"),this.extra.createMultiple(5,"sprites","extra1"),this.game.physics.enable(this.ball),this.game.physics.enable(this.platform1),this.game.physics.enable(this.platform2),this.game.physics.enable(this.extra),this.ball.body.bounce.set(.5),this.ball.body.collideWorldBounds=!1,this.ball.body.mass=1,this.ball.body.gravity.y=200,this.cursors=this.game.input.keyboard.createCursorKeys(),this.scoreText=this.addTextElement("score "+this.game.CS.score),this.scoreValue=this.game.add.image(2,4,this.scoreText),this.setInitialPlatforms(),this.spawnPlatform()},update:function(){this.ball.body.velocity.x=0,this.handleInput(),this.checkBoundaries(),this.checkAlive()||this.quitGame(),this.ball.body.velocity.y>100&&(this.ball.body.velocity.y=100),this.game.physics.arcade.overlap(this.ball,this.extra,this.getExtraCallback,null,this),this.game.physics.arcade.collide(this.platform1,this.ball),this.game.physics.arcade.collide(this.platform2,this.ball),this.levelVelocity=this.initialVelocity-this.platformCounter,this.scoreText.text="score "+this.game.CS.score},checkAlive:function(){return this.ball.y>-24&&this.ball.y<this.game.world.height+24},getExtraCallback:function(a,b){b.kill(),this.game.CS.score+=25,this.game.CS.audio.touch.play()},quitGame:function(){var a=this.game.CS.score>=this.game.CS.highscore;if(!this.dead){this.ball.kill(),this.game.CS.audio.crash.play(),this.game.time.events.remove(this.platformTimer),this.setVelocities(0),this.game.CS.highscore=Math.max(this.game.CS.highscore,this.game.CS.score),this.showEndModal(a);var b=this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);b.onUp.add(function(){this.ball.destroy(),this.platform1.destroy(),this.platform2.destroy(),this.extra.destroy(),this.modalLayer.destroy(),this.endTextImg.destroy(),this.game.state.start("MainMenu")},this),this.dead=!0}},addTextElement:function(a){var b=this.game.add.retroFont("font",8,8,"1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ:!?");return b.text=a,b},showEndModal:function(a){var b="";b+=a?"New Highscore!":"No Highscore!",this.modalLayer.bringToTop(),this.endModalBmp.context.fillRect(16,16,128,112),this.endModalBmp.dirty=!0,this.endText=this.addTextElement(b),this.endTextCtn=this.addTextElement("Press spacebar!"),this.endTextImg=this.game.add.image(this.game.world.centerX,-16,this.endText),this.endTextCtnImg=this.game.add.image(this.game.world.centerX,this.game.world.centerY+32,this.endTextCtn),this.endTextImg.anchor.setTo(.5,.5),this.endTextCtnImg.anchor.setTo(.5,.5);var c=this.game.add.tween(this.endTextImg);c.to({y:this.game.world.centerY},2e3,Phaser.Easing.Bounce.Out),c.start()},handleInput:function(){this.cursors.left.isDown&&(this.ball.body.velocity.x=-75),this.cursors.right.isDown&&(this.ball.body.velocity.x=75)},checkBoundaries:function(){this.ball.x>this.game.world.width+16&&(this.ball.x=-16),this.ball.x<-16&&(this.ball.x=this.game.world.width+16)},setInitialPlatforms:function(){for(var a=4,b=3;b--;)this.setPlatform("1",this.game.world.width/2-24,b,48);for(;a--;)for(var c=this.game.rnd.integerInRange(1,4),d=this.game.rnd.integerInRange(0,160-16*c);c--;)this.setPlatform("1",d,c,96+48*a)},setPlatform:function(a,b,c,d){var e=this["platform"+a].getFirstDead();null!==e&&(e.reset(b+16*c,d),e.outOfBoundsKill=!0,e.checkWorldBounds=!0,e.body.immovable=!0,e.body.checkCollision.up=!0,e.body.checkCollision.down=!0,e.body.checkCollision.left=!0,e.body.checkCollision.right=!0)},setVelocities:function(a){this.platform1.setAll("body.velocity.y",a),this.platform2.setAll("body.velocity.y",a),this.extra.setAll("body.velocity.y",a)},spawnPlatform:function(){this.platformCounter++,this.game.CS.score++;var a=this.game.rnd.integerInRange(1,2),b=this.game.rnd.integerInRange(1,3),c=this.game.rnd.integerInRange(0,160-16*b),d=160,e=150,f=this.platformCounter>44?2:1;if(this.platformCounter>5&&Math.random()>.65){var g=this.extra.getFirstDead();null!==g&&(g.reset(c+12,e),g.outOfBoundsKill=!0,g.checkWorldBounds=!0)}for(;b--;)this.setPlatform(a,c,b,d);this.setVelocities(this.levelVelocity),this.platformTimer=this.game.time.events.add(Phaser.Timer.SECOND*this.game.rnd.integerInRange(1,f),this.spawnPlatform,this),this.platformTimer.autoDestroy=!0},render:function(){this.game.CS.settings.pixelcontext.drawImage(this.game.canvas,0,0,this.game.CS.settings.originWidth,this.game.CS.settings.originHeight,0,0,this.game.CS.settings.pixelwidth,this.game.CS.settings.pixelheight)}},DropSomething.Help=function(a){this.game=a},DropSomething.Help.prototype={create:function(){this.game.stage.backgroundColor="#E0F8D0",this.spaceKey=this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),this.platform=this.add.sprite(12,12,"sprites","ground1"),this.extra=this.add.sprite(20,36,"sprites","extra1"),this.ball=this.add.sprite(8,52,"sprites","ball"),this.platformHelp=this.addTextElement("Hit platforms!"),this.collectHelp=this.addTextElement("Collect extras!"),this.cursorHelp=this.addTextElement("Use cursor l:r"),this.pressSpace=this.addTextElement("Back: Press Space!"),this.copyrightHelp1=this.addTextElement("Made by"),this.copyrightHelp2=this.addTextElement("Carsten Sandtner"),this.platformHelpImg=this.game.add.image(32,16,this.platformHelp),this.collectHelpImg=this.game.add.image(32,36,this.collectHelp),this.cursorHelpImg=this.game.add.image(32,52,this.cursorHelp),this.copyrightHelp1Img=this.game.add.image(16,this.game.world.height-22,this.copyrightHelp1),this.copyrightHelp2Img=this.game.add.image(16,this.game.world.height-12,this.copyrightHelp2),this.pressSpace=this.game.add.image(this.game.world.centerX,this.game.world.centerY+16,this.pressSpace),this.pressSpace.anchor.setTo(.5,.5),this.game.add.tween(this.ball).to({x:24},500,Phaser.Easing.Linear.None,!0,0,1e3,!0)},addTextElement:function(a){var b=this.game.add.retroFont("font",8,8,"1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ:!?");return b.text=a,b},update:function(){this.spaceKey.isDown&&this.back()},back:function(){this.platformHelpImg.destroy(),this.collectHelpImg.destroy(),this.copyrightHelp1Img.destroy(),this.copyrightHelp2Img.destroy(),this.pressSpace.destroy(),this.cursorHelpImg.destroy(),this.game.state.start("MainMenu")},render:function(){this.game.CS.settings.pixelcontext.drawImage(this.game.canvas,0,0,this.game.CS.settings.originWidth,this.game.CS.settings.originHeight,0,0,this.game.CS.settings.pixelwidth,this.game.CS.settings.pixelheight)}},DropSomething.MainMenu=function(a){this.game=a},DropSomething.MainMenu.prototype={create:function(){this.game.physics.startSystem(Phaser.Physics.ARCADE),this.game.stage.backgroundColor="#E0F8D0",this.platform=this.game.add.group(),this.platform.createMultiple(5,"sprites","ground1"),this.game.physics.enable(this.platform),this.spaceKey=this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),this.helpKey=this.game.input.keyboard.addKey(Phaser.Keyboard.H),this.welcome=this.addTextElement("Drop Something!"),this.scorefont=this.addTextElement("Highscore: "+this.game.CS.highscore),this.pressSpace=this.addTextElement("Press Space to play!"),this.help=this.addTextElement("Press H for help"),this.titleText=this.game.add.image(this.game.world.centerX-16,this.game.world.centerY,this.welcome),this.titleText.anchor.setTo(.5,.5),this.pressSpace=this.game.add.image(this.game.world.centerX,this.game.world.centerY+16,this.pressSpace),this.pressSpace.anchor.setTo(.5,.5),this.highscore=this.game.add.image(this.game.world.centerX,this.game.world.centerY-32,this.scorefont),this.highscore.anchor.setTo(.5,.5),this.helpHint=this.game.add.image(this.game.world.centerX,this.game.world.centerY+32,this.help),this.helpHint.anchor.setTo(.5,.5),this.game.add.tween(this.titleText).to({x:this.game.world.centerX+16},1e3,Phaser.Easing.Linear.None,!0,0,1e3,!0),this.game.time.events.loop(Phaser.Timer.SECOND,this.platformGenerator,this)},platformGenerator:function(){var a=this.platform.getFirstDead();null!==a&&(a.reset(this.game.rnd.integerInRange(16,144),160),a.outOfBoundsKill=!0,a.checkWorldBounds=!0,a.body.velocity.y=-75)},tweetScore:function(){var a="Wow! I've dropped a score of  "+this.game.CS.highscore+" points! How much do you get?",b=location.href,c="http://twitter.com/home?status="+encodeURIComponent(a+" "+b);window.open(c,"_blank")},addTextElement:function(a){var b=this.game.add.retroFont("font",8,8,"1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ:!?");return b.text=a,b},update:function(){this.spaceKey.isDown&&this.startGame(),this.helpKey.isDown&&this.showHelp()},showHelp:function(){this.cleanUp(),this.game.state.start("Help")},startGame:function(){this.cleanUp(),this.game.state.start("Game")},cleanUp:function(){this.titleText.destroy(),this.helpHint.destroy(),this.highscore.destroy(),this.pressSpace.destroy(),this.platform.destroy()},render:function(){this.game.CS.settings.pixelcontext.drawImage(this.game.canvas,0,0,this.game.CS.settings.originWidth,this.game.CS.settings.originHeight,0,0,this.game.CS.settings.pixelwidth,this.game.CS.settings.pixelheight)}},DropSomething.Preloader=function(a){this.game=a,this.background=null,this.preloadBar=null,this.loaded=!1},DropSomething.Preloader.prototype={preload:function(){var a="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAAAQCAYAAADOFPsRAAABuklEQVRYR+2ZMVIDMQxFd2/CESgpOQLllikpKTkCJSUl5ZYcISUlR+AmMMqMwkeRbMlymM3gNJuZ3W979fxlKZmv7+++psRnWa4S6ml6vH2eUwP8c/FMAFshrOvnRFq6tnxIOwC2RO5H0w1gdBMw/AGwI0CvkxgWOjDiRH52ODAHj9S/HMgALTfJ+xrAmhOlZjgwB/EEILoDh5aBp3sWQMvJOPZIoTlwrFYBIhzPd48TrWeGA3MgTYAMjq6YFhlEzYF4JmrOGw6sg3vaPxxbPGujbw5grS/9eHkr9o2XriesCG652R1Ir++vh6sEubkUavWlfK56AJaKMI9eZh32Cq3Bo5dVekQvAbKWQBJEF0BMkzi5LHDOUcRoAHGeSABlkooAsGIQmV+O4Zkf3SfXr0HcXBshAcozNxJAPMc5GBF9CwBcf1ZvnZLoQhVg7Xg9ZyPfIwC4flmARQBqFfhf6K0Uzu9lAqyB01KS1TfWxrKqUAbYI4VlUihqMyk8mkFo3tLv08UzsBb0EsColneZXBBXkVoh4jlDSi+f0bcWUa0ALReqAFuCf6yOOv+ddOltQHb9yAI3o9UHfgNTe4UvlswUmgAAAABJRU5ErkJggg==",b="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAgElEQVQ4T2NkgIKOAwX/YWxi6AqHCYwgdWDiwY8LJGmGWaDAYcDICLI5wiKBGEsx1Kw4sYABqwEaCgFgxTcebMBr8BAwAN396F4i6AWKDRjJgQgKPFhiQg5IrLFgkBHwf8OEBrKSckBBAyQzkWMISPOFGRsYwQbADCHFGSDNIPUA+x901a90FC0AAAAASUVORK5CYII=",c={frames:[{filename:"ground1",frame:{x:0,y:0,w:16,h:16},rotated:!1,trimmed:!1,spriteSourceSize:{x:0,y:0,w:16,h:16},sourceSize:{w:16,h:16}},{filename:"ground2",frame:{x:16,y:0,w:16,h:16},rotated:!1,trimmed:!1,spriteSourceSize:{x:0,y:0,w:32,h:16},sourceSize:{w:16,h:16}},{filename:"ball",frame:{x:100,y:7,w:9,h:9},rotated:!1,trimmed:!1,spriteSourceSize:{x:0,y:0,w:9,h:9},sourceSize:{w:9,h:9}},{filename:"extra1",frame:{x:36,y:8,w:8,h:8},rotated:!1,trimmed:!1,spriteSourceSize:{x:0,y:0,w:8,h:8},sourceSize:{w:8,h:8}},{filename:"extra2",frame:{x:52,y:8,w:8,h:8},rotated:!1,trimmed:!1,spriteSourceSize:{x:0,y:0,w:8,h:8},sourceSize:{w:8,h:8}},{filename:"extra3",frame:{x:68,y:8,w:8,h:8},rotated:!1,trimmed:!1,spriteSourceSize:{x:0,y:0,w:8,h:8},sourceSize:{w:8,h:8}},{filename:"extra4",frame:{x:84,y:8,w:8,h:8},rotated:!1,trimmed:!1,spriteSourceSize:{x:0,y:0,w:8,h:8},sourceSize:{w:8,h:8}}],meta:{app:"http://www.leshylabs.com/apps/sstool/",version:"Leshy SpriteSheet Tool v0.8.1",size:{w:112,h:16},scale:1}};this.game.load.atlas("sprites",a,null,c,Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY),this.game.load.image("twitter",b),this.player=new CPlayer,this.player.init(song);for(var d=[],e=0;1e3>e;e++)d[e]=128+Math.round(127*Math.sin(e/5));var f=new RIFFWAVE(d),g=[];for(e=0;1e3>e;e++)g[e]=Math.round(128*Math.random());var h=new RIFFWAVE(g);this.game.CS.audio.touch=new Audio(f.dataURI),this.game.CS.audio.crash=new Audio(h.dataURI),this.loading=this.game.add.retroFont("font",8,8,"1234567890ABCDEFGHIJKLMNOPQRSTUVWYXZ:!?"),this.loading.text="loading!",this.loader=this.game.add.image(this.game.world.centerX,this.game.world.centerY,this.loading),this.loader.anchor.setTo(.5,.5)},create:function(){this.game.stage.backgroundColor="#E0F8D0"},update:function(){if(this.ready=this.player.generate()>=1,this.ready===!0&&this.loaded===!1){this.loaded=!0;var a=this.player.createWave();this.game.CS.audio.song=document.createElement("audio"),this.game.CS.audio.song.src=URL.createObjectURL(new Blob([a],{type:"audio/wav"})),this.game.CS.audio.song.loop=!0,this.game.CS.audio.song.play(),this.loader.destroy(),this.game.state.start("MainMenu")}},render:function(){this.game.CS.settings.pixelcontext.drawImage(this.game.canvas,0,0,this.game.CS.settings.originWidth,this.game.CS.settings.originHeight,0,0,this.game.CS.settings.pixelwidth,this.game.CS.settings.pixelheight)}};
//# sourceMappingURL=game.map