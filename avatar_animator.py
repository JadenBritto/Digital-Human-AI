import subprocess
import json
import cv2
import numpy as np
from PIL import Image
from moviepy import VideoClip, AudioFileClip, CompositeVideoClip, ImageClip
import os

class AvatarAnimator:
    def __init__(self, avatar_base_path, mouth_shapes_dir, rhubarb_path=r"C:\Users\elson\Downloads\Rhubarb-Lip-Sync-1.14.0-Windows\rhubarb.exe"):
        self.avatar_base = cv2.imread(avatar_base_path)
        self.mouth_shapes_dir = mouth_shapes_dir
        self.rhubarb_path = rhubarb_path
        self.mouth_shapes = self._load_mouth_shapes()
        
    def _load_mouth_shapes(self):
        shapes = {}
        for shape in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'X']:
            path = os.path.join(self.mouth_shapes_dir, f"{shape}.png")
            if os.path.exists(path):
                shapes[shape] = cv2.imread(path, cv2.IMREAD_UNCHANGED)
        return shapes
    
    def generate_lip_sync_data(self, audio_file):
        output_json = "output/lip_sync.json"
        cmd = [self.rhubarb_path, "-f", "json", "-o", output_json, audio_file]
        
        try:
            subprocess.run(cmd, check=True, capture_output=True)
            with open(output_json, 'r') as f:
                return json.load(f)
        except subprocess.CalledProcessError as e:
            print(f"Rhubarb error: {e}")
            return None
    
    def create_animated_video(self, audio_file, output_file="output/avatar_video.mp4", emotion="neutral"):
        lip_sync_data = self.generate_lip_sync_data(audio_file)
        if not lip_sync_data:
            return None
        
        audio_clip = AudioFileClip(audio_file)
        duration = audio_clip.duration
        fps = 30
        
        def make_frame(t):
            current_time = t
            current_mouth = 'X'
            
            for cue in lip_sync_data['mouthCues']:
                if cue['start'] <= current_time < cue['end']:
                    current_mouth = cue['value']
                    break
            
            frame = self.avatar_base.copy()
            frame = self._apply_emotion(frame, emotion)
            frame = self._overlay_mouth(frame, current_mouth)
            
            return cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        video_clip = VideoClip(make_frame, duration=duration)
        video_clip = video_clip.set_audio(audio_clip)
        video_clip.write_videofile(output_file, fps=fps, codec='libx264')
        
        return output_file
    
    def _overlay_mouth(self, frame, mouth_shape):
        if mouth_shape not in self.mouth_shapes:
            return frame
        
        mouth_img = self.mouth_shapes[mouth_shape]
        h, w = frame.shape[:2]
        mouth_h, mouth_w = mouth_img.shape[:2]
        
        y_offset = int(h * 0.65)
        x_offset = int((w - mouth_w) / 2)
        
        if mouth_img.shape[2] == 4:
            alpha = mouth_img[:, :, 3] / 255.0
            for c in range(3):
                frame[y_offset:y_offset+mouth_h, x_offset:x_offset+mouth_w, c] = \
                    (alpha * mouth_img[:, :, c] + (1 - alpha) * frame[y_offset:y_offset+mouth_h, x_offset:x_offset+mouth_w, c])
        
        return frame
    
    def _apply_emotion(self, frame, emotion):
        # Emotion-based color tinting or effects
        if emotion == "happy":
            frame = cv2.convertScaleAbs(frame, alpha=1.1, beta=10)
        elif emotion == "sad":
            frame = cv2.convertScaleAbs(frame, alpha=0.9, beta=-10)
        return frame
