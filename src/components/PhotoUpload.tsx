"use client";

import { createClient } from "@/lib/supabase/client";
import { useRef, useState } from "react";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Camera } from "lucide-react";

export default function PhotoUpload({
  bucket,
  path,
  onUploaded,
  size = 96,
}: {
  bucket: string;
  path: string;
  onUploaded: (url: string) => void;
  size?: number;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${path}.${fileExt}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { upsert: true, cacheControl: "3600" });
    if (!error) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      setPreview(data.publicUrl);
      onUploaded(data.publicUrl);
    } else {
      alert("ছবি আপলোড ব্যর্থ হয়েছে: " + error.message);
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative overflow-hidden rounded-full ring-2 ring-accent-gold/40"
        style={{ width: size, height: size }}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="preview" className="h-full w-full object-cover" />
        ) : (
          <ImageWithFallback src={null} alt="ছবি" className="h-full w-full" iconLabel="ছবি" />
        )}
        <span className="absolute bottom-0 left-0 right-0 flex items-center justify-center bg-primary/70 py-1 text-[10px] text-cream">
          <Camera size={12} className="mr-1" /> আপলোড
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
      />
      {uploading && <span className="text-xs text-charcoal/50">আপলোড হচ্ছে...</span>}
    </div>
  );
}
