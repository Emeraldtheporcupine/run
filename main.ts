namespace SpriteKind {
    export const Collectable = SpriteKind.create()
    export const Fireball = SpriteKind.create()
    export const Rock = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    info.changeLifeBy(-3)
    sprites.destroy(otherSprite)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Fireball, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    sprites.destroy(otherSprite)
    music.play(music.createSoundEffect(WaveShape.Noise, 1413, 1, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Character.vy == 0) {
        Character.vy = -125
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Collectable, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    music.setVolume(255)
    info.changeScoreBy(1)
    music.play(music.createSoundEffect(WaveShape.Square, 1, 5000, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
})
scene.onHitWall(SpriteKind.Enemy, function (sprite, location) {
    tiles.setTileAt(location, assets.tile`transparency8`)
    tiles.setWallAt(location, false)
    Particles = [sprites.create(assets.image`myImage`, SpriteKind.Rock)]
    for (let index = 0; index < 3; index++) {
        Particles.unshift(sprites.create(assets.image`myImage`, SpriteKind.Rock))
    }
    for (let ParticleSprite of Particles) {
        ParticleSprite.ay = 400
        ParticleSprite.vx = randint(-10, 10)
        ParticleSprite.vy = randint(-200, -100)
        tiles.placeOnTile(ParticleSprite, location)
        timer.after(randint(0, 250), function () {
            music.play(music.createSoundEffect(WaveShape.Noise, 459, 1, 255, 0, 500, SoundExpressionEffect.Warble, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
            animation.runImageAnimation(
            ParticleSprite,
            assets.animation`Rock Fling`,
            50,
            true
            )
            timer.after(2000, function () {
                sprites.destroy(ParticleSprite)
            })
        })
    }
})
info.onLifeZero(function () {
    music.stopAllSounds()
    dead = true
    controller.moveSprite(Character, 0, 0)
    animation.runImageAnimation(
    Character,
    assets.animation`CharacterDEATH`,
    100,
    false
    )
    timer.after(1000, function () {
        game.gameOver(false)
    })
})
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Fireball, function (sprite, otherSprite) {
    sprites.destroy(otherSprite)
    music.play(music.createSong(hex`00c8000408010109010e02026400000403780000040a000301000000640001c80000040100000000640001640000040100000000fa0004af00000401c80000040a00019600000414000501006400140005010000002c0104dc00000401fa0000040a0001c8000004140005d0076400140005d0070000c800029001f40105c201f4010a0005900114001400039001000005c201f4010500058403050032000584030000fa00049001000005c201f4010500058403c80032000584030500640005840300009001049001000005c201f4010500058403c80064000584030500c8000584030000f40105ac0d000404a00f00000a0004ac0d2003010004a00f0000280004ac0d9001010004a00f0000280002d00700040408070f0064000408070000c80003c800c8000e7d00c80019000e64000f0032000e78000000fa00032c01c8000ee100c80019000ec8000f0032000edc000000fa0003f401c8000ea901c80019000e90010f0032000ea4010000fa0001c8000004014b000000c800012c01000401c8000000c8000190010004012c010000c80002c800000404c8000f0064000496000000c80002c2010004045e010f006400042c010000640002c409000404c4096400960004f6090000f40102b80b000404b80b64002c0104f40b0000f401022003000004200300040a000420030000ea01029001000004900100040a000490010000900102d007000410d0076400960010d0070000c8000600000001000108`), music.PlaybackMode.InBackground)
})
sprites.onOverlap(SpriteKind.Collectable, SpriteKind.Collectable, function (sprite, otherSprite) {
    sprite.vy = -50
})
let direction = 0
let Particles: Sprite[] = []
let groundFire: Sprite = null
let coin: Sprite = null
let fire: Sprite = null
let Character: Sprite = null
let dead = false
info.setLife(3)
let scroll = 0
dead = false
Character = sprites.create(assets.image`Character`, SpriteKind.Player)
controller.moveSprite(Character, 50, 0)
Character.setStayInScreen(true)
Character.ay = 400
scene.setBackgroundImage(assets.image`background`)
scene.centerCameraAt(0, 100)
music.play(music.createSong(assets.song`RUN`), music.PlaybackMode.LoopingInBackground)
tiles.setCurrentTilemap(tilemap`level1`)
tiles.placeOnTile(Character, tiles.getTileLocation(2, 6))
for (let fire_list of tiles.getTilesByType(assets.tile`fire`)) {
    fire = sprites.create(assets.image`Spawn1`, SpriteKind.Enemy)
    tiles.placeOnTile(fire, fire_list)
    fire.setStayInScreen(true)
    tiles.setTileAt(fire_list, assets.tile`transparency8`)
    animation.runImageAnimation(
    fire,
    assets.animation`Saw`,
    100,
    true
    )
}
for (let coin_list of tiles.getTilesByType(assets.tile`coin here`)) {
    coin = sprites.create(assets.image`Spawn2`, SpriteKind.Collectable)
    tiles.placeOnTile(coin, coin_list)
    tiles.setTileAt(coin_list, assets.tile`transparency8`)
    coin.ay = 400
    animation.runImageAnimation(
    coin,
    assets.animation`coin spin`,
    75,
    true
    )
}
for (let GroundFireList of tiles.getTilesByType(assets.tile`FIRE`)) {
    groundFire = sprites.create(assets.image`Spawn2`, SpriteKind.Fireball)
    tiles.placeOnTile(groundFire, GroundFireList)
    tiles.setTileAt(GroundFireList, assets.tile`transparency8`)
    groundFire.ay = 400
    animation.runImageAnimation(
    groundFire,
    assets.animation`GroundFire`,
    100,
    true
    )
}
game.onUpdateInterval(400, function () {
    if (dead == false) {
        if (Character.vx > 0) {
            animation.runImageAnimation(
            Character,
            assets.animation`CharacterWalkR`,
            200,
            true
            )
        } else if (Character.vx < 0) {
            animation.runImageAnimation(
            Character,
            assets.animation`CharacterWalkL`,
            200,
            true
            )
        } else if (direction < 0) {
            animation.runImageAnimation(
            Character,
            assets.animation`CharacterIdleL`,
            200,
            true
            )
        } else if (direction > 0) {
            animation.runImageAnimation(
            Character,
            assets.animation`CharacterIdle`,
            200,
            true
            )
        } else if (Character.vy > 0 || Character.vy < 0) {
            if (direction < 0) {
                animation.runImageAnimation(
                Character,
                assets.animation`CharacterJumpAnimL`,
                200,
                true
                )
            } else if (direction > 0) {
                animation.runImageAnimation(
                Character,
                assets.animation`CharacterJumpAnim`,
                200,
                true
                )
            }
        } else {
        	
        }
    }
})
game.onUpdate(function () {
    if (dead == false) {
        scroll += 0.5
        scene.centerCameraAt(scroll, 100)
    }
})
game.onUpdate(function () {
    if (Character.vx > 0) {
        direction = 1
    } else if (Character.vx < 0) {
        direction = -1
    }
})
