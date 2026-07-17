#!/bin/sh
# তানযীমুল উম্মাহ — ডেভ সার্ভার স্টপার
# ব্যবহার: ~/tanzimul-ummah/stop.sh
pkill -9 -f "next/dist" 2>/dev/null
pkill -9 -f "next-server" 2>/dev/null
sleep 1
echo "🛑 সার্ভার বন্ধ করা হয়েছে।"
