#!/bin/sh
# তানযীমুল উম্মাহ — ডেভ সার্ভার স্টার্টার
# ব্যবহার: ~/tanzimul-ummah/start.sh   (Termux এ ওপেন করেই রান করবে)
#
# এটা সার্ভারকে ব্যাকগ্রাউন্ডে চালু করে, তাই Termux অ্যাপ বন্ধ করলেও
# (অথবা সেশন এক্সিট করলেও) সার্ভার চলতে থাকবে।
# বন্ধ করতে চাইলে: ~/tanzimul-ummah/stop.sh

export NEXT_DISABLE_SWC_NATIVE=1
cd /data/data/com.termux/files/home/tanzimul-ummah

# পুরানো স্টেল প্রসেস ক্লিন করো
pkill -9 -f "next/dist" 2>/dev/null
pkill -9 -f "next-server" 2>/dev/null
sleep 1

# লগ ক্লিন
rm -f /data/data/com.termux/files/home/tmp/devlog.txt

# ব্যাকগ্রাউন্ডে স্টার্ট (nohup দিয়ে সেশন বাঁচিয়ে রাখে)
nohup env PORT=3000 npm run dev > /data/data/com.termux/files/home/tmp/devlog.txt 2>&1 &

echo "✅ সার্ভার স্টার্ট হয়েছে... (১০-১৫ সেকেন্ড লাগবে রেডি হতে)"
echo "📱 ফোন ব্রাউজারে যাও: http://192.168.0.144:3000"
echo "💻 কম্পিউটার/এমুলেটরে: http://localhost:3000"
echo ""
echo "স্ট্যাটাস চেক: curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/"
echo "লগ দেখো: tail -f ~/tmp/devlog.txt"
echo "বন্ধ করো: ~/tanzimul-ummah/stop.sh"
