from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/Assets", StaticFiles(directory="Assets"), name="assets")
app.mount("/story", StaticFiles(directory="Story"), name="story")
app.mount("/home", StaticFiles(directory="Home"), name="home")


@app.get("/")
async def read_index():
    return RedirectResponse(url="/home/home.html")


@app.get("/story")
async def read_index():
    return RedirectResponse(url="/story/story.html")
