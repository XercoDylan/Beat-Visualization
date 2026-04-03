from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/Home", StaticFiles(directory="Home"), name="home")
app.mount("/Story", StaticFiles(directory="Story"), name="story")

@app.get("/")
async def read_index():
    return RedirectResponse(url="/Home/home.html")


@app.get("/story")
async def read_story():
    return RedirectResponse(url="/Story/story.html")
