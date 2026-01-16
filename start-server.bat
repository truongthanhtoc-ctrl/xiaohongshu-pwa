@echo off
echo ========================================
echo   小红书AI收集器 - PWA版本
echo ========================================
echo.
echo 正在启动本地服务器...
echo.
echo 服务器地址: http://localhost:8000
echo.
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

python -m http.server 8000
