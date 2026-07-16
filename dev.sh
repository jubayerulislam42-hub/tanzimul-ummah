#!/bin/sh
# Termux dev launcher: kills stale next procs, forces port 3000, uses wasm SWC.
export NEXT_DISABLE_SWC_NATIVE=1
pkill -9 -f "next/dist" 2>/dev/null
pkill -9 -f "next-server" 2>/dev/null
sleep 1
cd /data/data/com.termux/files/home/tanzimul-ummah
rm -f /data/data/com.termux/files/home/tmp/devlog.txt
PORT=3000 npm run dev > /data/data/com.termux/files/home/tmp/devlog.txt 2>&1
