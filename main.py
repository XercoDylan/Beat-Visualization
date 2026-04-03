from fastapi import FastAPI
from fastapi.responses import RedirectResponse

app = FastAPI()

@app.get("/")
async def read_index():
    return RedirectResponse(url="/Home/home.html")


@app.get("/story")
async def read_story():
    return RedirectResponse(url="/Story/story.html")
