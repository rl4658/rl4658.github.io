import glob
import os
from PIL import Image

def build_cropped_previews():
    # Load all frames from the existing 548x1080 GIF
    src_gif = 'public/images/formfixer_preview.gif'
    gif = Image.open(src_gif)
    print(f'Loading {gif.n_frames} frames from {src_gif}...')

    cropped_rgb_frames = []
    # Crop exact phone area: x: 0 to 487, y: 0 to 1060 (removes right black pillarbox and bottom padding)
    crop_box = (0, 0, 487, 1060)

    for i in range(gif.n_frames):
        gif.seek(i)
        rgb_frame = gif.convert('RGB').crop(crop_box)
        cropped_rgb_frames.append(rgb_frame)

    print(f'Cropped frames size: {cropped_rgb_frames[0].size}')

    gif_path = 'public/images/formfixer_preview.gif'
    webp_path = 'public/images/formfixer_preview.webp'

    # 1. Quantize with MEDIANCUT and dither=NONE for razor-sharp text
    print('Quantizing frames with local palettes and dither=NONE...')
    quantized_frames = [
        im.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
        for im in cropped_rgb_frames
    ]

    print(f'Saving cropped GIF to {gif_path}...')
    quantized_frames[0].save(
        gif_path,
        save_all=True,
        append_images=quantized_frames[1:],
        duration=100,
        loop=0,
        disposal=2
    )
    gif_size_mb = os.path.getsize(gif_path) / (1024 * 1024)
    print(f'Generated cropped {gif_path}: {gif_size_mb:.2f} MB')

    # 2. Save cropped animated WebP
    print(f'Saving cropped WebP to {webp_path}...')
    cropped_rgb_frames[0].save(
        webp_path,
        format='WEBP',
        save_all=True,
        append_images=cropped_rgb_frames[1:],
        duration=100,
        loop=0,
        quality=92,
        method=4
    )
    webp_size_mb = os.path.getsize(webp_path) / (1024 * 1024)
    print(f'Generated cropped {webp_path}: {webp_size_mb:.2f} MB')

if __name__ == '__main__':
    build_cropped_previews()
