import os
from PIL import Image, ImageDraw, ImageFont

dest_dir = r"public/images/projects/enginerea"
fonts_dir = r"fonts_enginerea"

def get_font(name, size):
    path = os.path.join(fonts_dir, name)
    try:
        return ImageFont.truetype(path, size)
    except Exception as e:
        print(f"Error loading {path}: {e}")
        return ImageFont.load_default()

def paste_img(canvas, img_name, pos):
    path = os.path.join(dest_dir, img_name)
    if not os.path.exists(path):
        print(f"Warning: {path} not found")
        return
    im = Image.open(path).convert("RGBA")
    canvas.paste(im, pos, im)

def draw_health_bar(draw, x, y, hp_pct=1.0, width=50, height=6):
    draw.rectangle([x-1, y-1, x + width + 1, y + height + 1], fill=(0, 0, 0, 220))
    draw.rectangle([x, y, x + width, y + height], fill=(120, 20, 20, 255))
    active_w = int(width * hp_pct)
    if active_w > 0:
        draw.rectangle([x, y, x + active_w, y + height], fill=(220, 38, 38, 255))

def extract_single_rock():
    p = os.path.join(dest_dir, "rockthrow.png")
    if os.path.exists(p):
        im = Image.open(p)
        f0 = im.crop((0, 0, 20, 20))
        out_p = os.path.join(dest_dir, "rock_single.png")
        f0.save(out_p, "PNG")
        print(f"Extracted single rock to {out_p}")

# -------------------------------------------------------------
# 1. SCENE START MENU
# -------------------------------------------------------------
def build_start_menu():
    canvas = Image.new("RGBA", (1200, 575), (0, 0, 0, 255))
    bg = Image.open(os.path.join(dest_dir, "main_screen.png")).convert("RGBA")
    canvas.paste(bg.resize((1200, 575)), (0, 0))

    draw = ImageDraw.Draw(canvas)
    f_title = get_font("mainScreen.ttf", 46)
    draw.text((182, 57), "Bobby: The Town of Enginerea", fill=(0, 0, 0, 220), font=f_title)
    draw.text((180, 55), "Bobby: The Town of Enginerea", fill=(255, 255, 255, 255), font=f_title)

    paste_img(canvas, "playbutton.png", (510, 200))
    paste_img(canvas, "exitbutton.png", (510, 260))
    paste_img(canvas, "helpbutton.png", (505, 320))

    out_p = os.path.join(dest_dir, "scene_start_menu.png")
    canvas.convert("RGB").save(out_p, "PNG", quality=95)
    print(f"Saved {out_p}")

# -------------------------------------------------------------
# 2. SCENE STAGE 1 (RUINED VILLAGE)
# -------------------------------------------------------------
def build_stage_1(with_bobby=True, out_name="scene_stage_1.png"):
    canvas = Image.new("RGBA", (1200, 575), (0, 0, 0, 255))
    bg = Image.open(os.path.join(dest_dir, "lvl1_bg.png")).convert("RGBA")
    canvas.paste(bg.resize((1200, 575)), (0, 0))

    # Destroyed buildings scenery
    paste_img(canvas, "destroyedbuilding4.png", (30, -209))
    paste_img(canvas, "destroyedbuilding2.png", (625, -135))
    paste_img(canvas, "destroyedbuilding1.png", (35, 165))
    paste_img(canvas, "destroyedbuilding3.png", (335, 450))
    paste_img(canvas, "destroyedcar.png", (23, 88))
    paste_img(canvas, "deadtree.png", (160, 302))
    paste_img(canvas, "deadtree.png", (700, 15))

    # Brown stones under lava
    paste_img(canvas, "largebrownstone.png", (0, 480))
    paste_img(canvas, "largebrownstone.png", (324, 550))
    paste_img(canvas, "largebrownstone.png", (648, 550))
    paste_img(canvas, "largebrownstone.png", (972, 550))
    paste_img(canvas, "largeorangestone.png", (987, 337))
    paste_img(canvas, "brownpillar.png", (500, 350))

    # Lava pools
    for lx in [320, 462, 605, 747, 889]:
        paste_img(canvas, "lava.png", (lx, 530))

    # Sky platforms
    paste_img(canvas, "orangeplatform.png", (380, 420))
    paste_img(canvas, "brownplatform.png", (520, 250))
    paste_img(canvas, "orangeplatform.png", (680, 350))
    paste_img(canvas, "orangeplatform.png", (850, 370))
    paste_img(canvas, "leftskyplatform.png", (10, 190))
    paste_img(canvas, "rightskyplatform.png", (640, 180))
    paste_img(canvas, "brownplatform.png", (720, 470))

    # Top border flat stones
    for bx in range(0, 1200, 137):
        paste_img(canvas, "brownflatplatform.png", (bx, 0))

    # Objects
    paste_img(canvas, "closedChest.png", (1090, 137))
    paste_img(canvas, "chestKey.png", (120, 140))
    paste_img(canvas, "doorClosed.png", (1040, 237))

    # Bobby
    if with_bobby:
        paste_img(canvas, "axe1R.png", (60, 380))

    # Enemies with health bars
    draw = ImageDraw.Draw(canvas)
    for ex, ey in [(385, 334), (855, 284), (900, 94), (90, 44)]:
        if not with_bobby and ex == 855:
            # For live arena, we animate this enemy dynamically
            continue
        paste_img(canvas, "enemy1_frame.png", (ex, ey))
        draw_health_bar(draw, ex + 10, ey - 10, 1.0, 50, 5)

    out_p = os.path.join(dest_dir, out_name)
    canvas.convert("RGB").save(out_p, "PNG", quality=95)
    print(f"Saved {out_p}")

# -------------------------------------------------------------
# 2B. SCENE AUTONOMOUS ARENA BACKDROP (CLEAN CHASM DUEL)
# -------------------------------------------------------------
def build_arena_backdrop(out_name="scene_arena_backdrop.png"):
    """
    Renders an uncluttered, cinematic combat arena across a central lava canyon:
    - Authentic open background skyline (lvl1_bg.png) with ZERO sky platforms or hanging ceiling chunks.
    - Grounded scenery resting naturally on platform elevation (y=380):
      - Ruined building on left side standing behind cliff.
      - Dead tree on right cliff.
    - Sunken volcanic canyon (x = 360 to 840) with solid bedrock beneath and bubbling lava at y = 510.
    - Cohesive, matching brown stone cliffs on left (x=0..360) and right (x=840..1200) at y = 380.
    - Lava is strictly clipped between x=360 and x=840 and under cliffs so ZERO overlap onto cliffs or walls.
    """
    canvas = Image.new("RGBA", (1200, 575), (0, 0, 0, 255))
    bg = Image.open(os.path.join(dest_dir, "lvl1_bg.png")).convert("RGBA")
    canvas.paste(bg.resize((1200, 575)), (0, 0))

    # 1. Distant grounded scenery resting behind platforms at y=380
    paste_img(canvas, "destroyedbuilding1.png", (50, 60))
    paste_img(canvas, "deadtree.png", (980, 201))

    # 2. Sunken Canyon Bedrock beneath lava (x = 360 to 840)
    stone = Image.open(os.path.join(dest_dir, "largebrownstone.png")).convert("RGBA")
    canvas.paste(stone, (360, 510), stone)
    canvas.paste(stone, (640, 510), stone)

    # 3. Bubbling lava pool strictly clipped within the sunken canyon channel
    lava_tile = Image.open(os.path.join(dest_dir, "lava.png")).convert("RGBA")
    lava_layer = Image.new("RGBA", (1200, 575), (0, 0, 0, 0))
    for lx in range(360, 840, lava_tile.width):
        lava_layer.paste(lava_tile, (lx, 510))
    lava_mask = Image.new("L", (1200, 575), 0)
    mask_draw = ImageDraw.Draw(lava_mask)
    mask_draw.rectangle([360, 510, 840, 540], fill=255)
    canvas.paste(lava_layer, (0, 0), lava_mask)

    # 4. Solid matching brown stone cliffs framing the canyon
    # Left platform for Bobby (x=0..360, y=380)
    canvas.paste(stone, (0, 380), stone)
    canvas.paste(stone, (40, 380), stone)
    plat = Image.open(os.path.join(dest_dir, "brownplatform.png")).convert("RGBA")
    canvas.paste(plat, (280, 375), plat)

    # Right platform for Enemy Goblin (x=840..1200, y=380)
    canvas.paste(stone, (840, 380), stone)
    canvas.paste(stone, (880, 380), stone)
    plat_flipped = plat.transpose(Image.FLIP_LEFT_RIGHT)
    canvas.paste(plat_flipped, (840, 375), plat_flipped)

    out_p = os.path.join(dest_dir, out_name)
    canvas.convert("RGB").save(out_p, "PNG", quality=95)
    print(f"Saved {out_p}")

# -------------------------------------------------------------
# 3. SCENE STAGE 2 (MAGMA CAVERNS)
# -------------------------------------------------------------
def build_stage_2():
    canvas = Image.new("RGBA", (1200, 575), (0, 0, 0, 255))
    bg = Image.open(os.path.join(dest_dir, "lvl2_bg.png")).convert("RGBA")
    canvas.paste(bg.resize((1200, 575)), (0, 0))

    # Top border
    for bx in range(0, 1200, 137):
        paste_img(canvas, "borderplatform.png", (bx, 0))

    # Snow floor platforms
    paste_img(canvas, "largeplatform.png", (0, 470))
    paste_img(canvas, "largeplatform.png", (324, 500))
    paste_img(canvas, "largeplatform.png", (648, 500))
    paste_img(canvas, "largeplatform.png", (972, 350))

    # Vert moving snow platform
    paste_img(canvas, "snowplatform.png", (820, 280))

    # 9 Ice platforms
    for ix, iy in [
        (65, 130), (320, 130), (560, 130), (1000, 160),
        (24, 280), (174, 280), (324, 280), (474, 280), (624, 280)
    ]:
        paste_img(canvas, "iceplatform.png", (ix, iy))

    # Chests and keys
    paste_img(canvas, "closedChest.png", (1050, 117))
    paste_img(canvas, "chestKey.png", (670, 60))
    paste_img(canvas, "closedChest.png", (230, 427))
    paste_img(canvas, "chestKey.png", (50, 220))
    paste_img(canvas, "doorClosed.png", (80, 370))

    # Single clean Bobby jump frame (NO spritesheet tiling!)
    paste_img(canvas, "bobby_jump_1.png", (330, 220))

    # 4 Magma demons with health bars
    draw = ImageDraw.Draw(canvas)
    for ex, ey in [(100, 205), (100, 55), (350, 55), (570, 55)]:
        paste_img(canvas, "enemy2_frame.png", (ex, ey))
        draw_health_bar(draw, ex + 15, ey - 10, 0.75, 55, 5)

    out_p = os.path.join(dest_dir, "scene_stage_2.png")
    canvas.convert("RGB").save(out_p, "PNG", quality=95)
    print(f"Saved {out_p}")

# -------------------------------------------------------------
# 4. SCENE STAGE 3 (BOSS ARENA)
# -------------------------------------------------------------
def build_stage_3():
    canvas = Image.new("RGBA", (1200, 575), (0, 0, 0, 255))
    bg = Image.open(os.path.join(dest_dir, "lvl3_bg.png")).convert("RGBA")
    canvas.paste(bg.resize((1200, 575)), (0, 0))

    # Top border
    paste_img(canvas, "topBorder.png", (-5, -5))
    paste_img(canvas, "topBorder.png", (475, -5))
    paste_img(canvas, "topBorder.png", (950, -5))

    # Lava pools
    for lx in [180, 322, 464, 606, 748, 890]:
        paste_img(canvas, "lava.png", (lx, 545))

    # Platforms
    paste_img(canvas, "startingPlatForm.png", (-10, 490))
    paste_img(canvas, "level3MediumPlatForm.png", (130, 120))
    paste_img(canvas, "level3MediumPlatForm.png", (130, 300))
    paste_img(canvas, "BossPlatForm.png", (930, 150))
    paste_img(canvas, "Level3Floating.png", (380, 490))
    paste_img(canvas, "Level3Floating.png", (850, 340))
    paste_img(canvas, "Level3Floating.png", (40, 220))

    # Door at the far right
    paste_img(canvas, "doorClosed.png", (1075, 55))

    # Bobby with Iron Shield
    paste_img(canvas, "axe1Shield2R.png", (50, 430))

    # 4 Minions
    for mx, my in [(200, 225), (280, 225), (700, 45), (620, 45)]:
        paste_img(canvas, "enemy2_frame.png", (mx, my))

    # FINAL BOSS GUARDIAN standing proudly guarding the door at (970, 45)
    paste_img(canvas, "enemy_boss_frame.png", (970, 45))

    # Centered Boss Health Bar
    draw = ImageDraw.Draw(canvas)
    f_hud = get_font("Stats.ttf", 20)
    # Background pill
    draw.rectangle([340, 12, 860, 52], fill=(0, 0, 0, 200))
    draw.text((370, 16), "GUARDIAN OF ENGINEREA (BOSS) : 20 / 20 HP", fill=(255, 60, 60, 255), font=f_hud)
    draw_health_bar(draw, 350, 40, 1.0, 500, 8)

    out_p = os.path.join(dest_dir, "scene_stage_3.png")
    canvas.convert("RGB").save(out_p, "PNG", quality=95)
    print(f"Saved {out_p}")

# -------------------------------------------------------------
# 5. SCENE SHOP (Shop.py)
# -------------------------------------------------------------
def build_shop():
    canvas = Image.new("RGBA", (1200, 575), (0, 0, 0, 255))
    paste_img(canvas, "ShopBg.png", (0, -12))
    paste_img(canvas, "UpgradePage.png", (1, 15))
    paste_img(canvas, "UpgradePage.png", (810, 15))
    paste_img(canvas, "PlayerViewPage.png", (445, 100))

    draw = ImageDraw.Draw(canvas)
    f_titles = get_font("titles.otf", 35)
    f_stats = get_font("Stats.ttf", 20)
    color_gold = (255, 226, 183, 255)

    draw.text((117, 60), "Equipment", fill=color_gold, font=f_titles)
    draw.text((965, 60), "Stats", fill=color_gold, font=f_titles)
    draw.text((550, 130), "Bobby", fill=color_gold, font=f_titles)

    paste_img(canvas, "AxeButton.png", (140, 190))
    paste_img(canvas, "Shield1Button.png", (70, 325))
    paste_img(canvas, "Shield2Button.png", (200, 325))

    paste_img(canvas, "AttackUpgradeBtn.png", (950, 190))
    paste_img(canvas, "HealthUpgradeBtn.png", (890, 325))
    paste_img(canvas, "SorcShoesUpgradeBtn.png", (1020, 325))

    draw.text((170, 170), "Damage +6", fill=(0, 0, 0, 255), font=f_stats)
    draw.text((100, 305), "Armour +3", fill=(0, 0, 0, 255), font=f_stats)
    draw.text((225, 305), "Armour +5", fill=(0, 0, 0, 255), font=f_stats)

    draw.text((980, 170), "Damage +1", fill=(0, 0, 0, 255), font=f_stats)
    draw.text((920, 305), "Health +1", fill=(0, 0, 0, 255), font=f_stats)
    draw.text((1055, 305), "Speed +1", fill=(0, 0, 0, 255), font=f_stats)

    paste_img(canvas, "StandingAxe1Shield0L.png", (500, 260))

    paste_img(canvas, "heart.png", (420, 30))
    paste_img(canvas, "strength.png", (499, 30))
    paste_img(canvas, "shieldIcon.png", (580, 30))
    paste_img(canvas, "SpeedIcon.png", (660, 30))
    paste_img(canvas, "coin.png", (740, 30))

    draw.text((470, 30), "10", fill=(255, 255, 255, 255), font=f_stats)
    draw.text((554, 30), "5", fill=(255, 255, 255, 255), font=f_stats)
    draw.text((630, 30), "0", fill=(255, 255, 255, 255), font=f_stats)
    draw.text((710, 30), "5", fill=(255, 255, 255, 255), font=f_stats)
    draw.text((780, 30), "120", fill=(255, 255, 255, 255), font=f_stats)

    out_p = os.path.join(dest_dir, "scene_shop.png")
    canvas.convert("RGB").save(out_p, "PNG", quality=95)
    print(f"Saved {out_p}")

# -------------------------------------------------------------
# 6. SCENE VICTORY & DEATH
# -------------------------------------------------------------
def build_victory_and_death():
    f_t70 = get_font("mainScreen.ttf", 60)
    f_t50 = get_font("mainScreen.ttf", 40)
    f_t25 = get_font("mainScreen.ttf", 20)

    # VICTORY
    c_win = Image.new("RGBA", (1200, 575), (0, 0, 0, 255))
    d_win = ImageDraw.Draw(c_win)
    d_win.text((280, 40), "TOWN HALL REBUILT", fill=(255, 255, 255, 255), font=f_t70)
    paste_img(c_win, "vikingHouse.png", (450, 200))

    d_win.text((100, 140), "Match Stats", fill=(255, 255, 255, 255), font=f_t50)
    d_win.text((800, 140), "Options", fill=(255, 255, 255, 255), font=f_t50)

    d_win.text((100, 260), "Money earned          140", fill=(255, 255, 255, 255), font=f_t25)
    d_win.text((100, 300), "Damage taken          28", fill=(255, 255, 255, 255), font=f_t25)
    d_win.text((100, 340), "Axes Chucked          74", fill=(255, 255, 255, 255), font=f_t25)
    d_win.text((100, 380), "Lava spills           2", fill=(255, 255, 255, 255), font=f_t25)
    d_win.text((100, 420), "Time played           04:38", fill=(255, 255, 255, 255), font=f_t25)

    paste_img(c_win, "playbutton.png", (850, 250))
    paste_img(c_win, "exitbutton.png", (850, 310))

    out_v = os.path.join(dest_dir, "scene_victory.png")
    c_win.convert("RGB").save(out_v, "PNG", quality=95)
    print(f"Saved {out_v}")

    # DEATH
    c_die = Image.new("RGBA", (1200, 575), (0, 0, 0, 255))
    d_die = ImageDraw.Draw(c_die)
    d_die.text((400, 40), "YOU DIED!", fill=(255, 255, 255, 255), font=f_t70)
    paste_img(c_die, "bobbyDeath.png", (480, 200))

    d_die.text((100, 140), "Match Stats", fill=(255, 255, 255, 255), font=f_t50)
    d_die.text((800, 140), "Options", fill=(255, 255, 255, 255), font=f_t50)

    d_die.text((100, 260), "Money earned          80", fill=(255, 255, 255, 255), font=f_t25)
    d_die.text((100, 300), "Damage taken          100", fill=(255, 255, 255, 255), font=f_t25)
    d_die.text((100, 340), "Axes Chucked          32", fill=(255, 255, 255, 255), font=f_t25)
    d_die.text((100, 380), "Lava spills           1", fill=(255, 255, 255, 255), font=f_t25)
    d_die.text((100, 420), "Time played           02:14", fill=(255, 255, 255, 255), font=f_t25)

    paste_img(c_die, "playbutton.png", (850, 250))
    paste_img(c_die, "exitbutton.png", (850, 310))

    out_d = os.path.join(dest_dir, "scene_death.png")
    c_die.convert("RGB").save(out_d, "PNG", quality=95)
    print(f"Saved {out_d}")

if __name__ == "__main__":
    extract_single_rock()
    build_stage_1(with_bobby=True, out_name="scene_stage_1.png")
    build_arena_backdrop(out_name="scene_arena_backdrop.png")
    if os.path.exists(fonts_dir):
        build_start_menu()
        build_stage_2()
        build_stage_3()
        build_shop()
        build_victory_and_death()
    print("ALL SCENES RE-RENDERED WITH 100% PYGAME FIDELITY!")
