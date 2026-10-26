import glob
import os
from PIL import Image

def build_previews():
    files = sorted(glob.glob('scripts/rep_frames/frame_*.jpg'))
    print(f'Loading {len(files)} 1080p frames...')
    images = [Image.open(f) for f in files]

    # Target path
    gif_path = 'public/images/formfixer_preview.gif'
    webp_path = 'public/images/formfixer_preview.webp'

    # 1. Generate full native 1080p GIF (548x1080)
    print('Quantizing frames with MEDIANCUT and dither=NONE for razor-sharp text...')
    quantized_frames = [
        im.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
        for im in images
    ]

    print(f'Saving GIF to {gif_path}...')
    quantized_frames[0].save(
        gif_path,
        save_all=True,
        append_images=quantized_frames[1:],
        duration=100,  # 100ms per frame = 10 fps
        loop=0,
        disposal=2
    )
    gif_size_mb = os.path.getsize(gif_path) / (1024 * 1024)
    print(f'Generated {gif_path}: {gif_size_mb:.2f} MB')

    # 2. Generate animated WebP (true 24-bit color, ultra fast load, ~2.8 MB)
    print(f'Saving WebP to {webp_path}...')
    images[0].save(
        webp_path,
        format='WEBP',
        save_all=True,
        append_images=images[1:],
        duration=100,
        loop=0,
        quality=92,
        method=4
    )
    webp_size_mb = os.path.getsize(webp_path) / (1024 * 1024)
    print(f'Generated {webp_path}: {webp_size_mb:.2f} MB')

if __name__ == '__main__':
    build_previews()
