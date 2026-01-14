@echo off
REM Quick fix script for Amora generic responses issue (Windows)
REM This runs all diagnostic and fix steps in order

echo ==========================================
echo  AMORA QUICK FIX SCRIPT (Windows)
echo ==========================================
echo.

REM Check if we're in the right directory
if not exist "backend\scripts\diagnose_amora.py" (
    echo Error: Run this script from the project root directory
    exit /b 1
)

REM Step 1: Run diagnostic
echo [Step 1/3] Running diagnostic...
echo.
python backend\scripts\diagnose_amora.py

echo.
echo ------------------------------------------
echo.

REM Step 2: Check if templates exist
echo [Step 2/3] Checking template status...
echo.
set /p no_templates="Did the diagnostic show 'No templates found'? (y/n): "

if /i "%no_templates%"=="y" (
    echo.
    echo WARNING: You need to run SQL migrations in Supabase first:
    echo    1. Open Supabase SQL Editor
    echo    2. Run: backend/migrations/002_amora_templates.sql
    echo    3. Run: backend/migrations/004_add_common_question_templates.sql
    echo.
    set /p ran_migrations="Have you run the SQL migrations? (y/n): "
    
    if /i not "%ran_migrations%"=="y" (
        echo Error: Please run the SQL migrations first, then run this script again
        exit /b 1
    )
)

REM Step 3: Compute embeddings
echo [Step 3/3] Computing embeddings...
echo.
set /p need_embeddings="Do templates need embeddings computed? (y/n): "

if /i "%need_embeddings%"=="y" (
    echo.
    python backend\scripts\add_template_embeddings.py
    
    if errorlevel 1 (
        echo.
        echo Error computing embeddings
        exit /b 1
    ) else (
        echo.
        echo Embeddings computed successfully!
    )
)

REM Final verification
echo.
echo ==========================================
echo  FINAL VERIFICATION
echo ==========================================
echo.

python backend\scripts\diagnose_amora.py

echo.
echo ==========================================
echo  DONE!
echo ==========================================
echo.
echo If all checks passed above, your Amora Enhanced Service
echo should now be working correctly.
echo.
echo Test it with:
echo   - Visit your frontend and ask: "How does my past affect my present relationships?"
echo.

pause
