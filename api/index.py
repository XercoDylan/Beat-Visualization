from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse

ROOT_DIR = Path(__file__).parent.parent

app = FastAPI()

app.mount("/Assets", StaticFiles(directory=str(ROOT_DIR / "Assets")), name="assets")
app.mount("/Story", StaticFiles(directory=str(ROOT_DIR / "Story")), name="story_files")
app.mount("/Home", StaticFiles(directory=str(ROOT_DIR / "Home")), name="home_files")


@app.get("/")
async def read_index():
    return RedirectResponse(url="/Home/home.html")


@app.get("/story")
async def read_story():
    return RedirectResponse(url="/Story/story.html")
