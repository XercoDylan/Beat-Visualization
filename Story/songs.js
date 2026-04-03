const data = {
    "Drag Rap": {
        "children": ["Wipe Me Down", "Back That Azz Up", "Where Dey At", "Gangsta Walk"],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 1,
        "year": 1986,
        "description": "This track serves as the starting point for this genre. Two teenagers from Queens make this song as a parody of the 1950s police drama Dragnet. The song flopped in New York but migrated South on cassette tapes, where it became the foundation of an entire genre. Listen for the TR-808 drums, the xylophone, and the looped synth riff. These are the stems that will be chopped and looped for the subsequent four decades."
    },

    "Wipe Me Down": {
        "children": ["Whatchu Kno 'Bout Me"],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 22,
        "year": 2007,
        "description": "This mid-2000s Louisiana staple demonstrates the beat's influence bleeding out of New Orleans into neighboring Baton Rouge. It bridges the gap between high-BPM club bounce and the modern, heavier Southern trap sound. A frequent inclusion in many club sets and playlists to this day, \"Wipe Me Down\" is a pivotal track that has shaped the sound of music nationwide. Listen for the call-and-response of the Bounce Sound, and the \"Drag Rap\" sample in the drum fill before each section change."
    },

    "Whatchu Kno 'Bout Me": {
        "children": [],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 39,
        "year": 2024,
        "description": "This track demonstrates the multi-generational game of telephone that is sampling. This modern crunk anthem directly samples Boosie's \"Wipe Me Down,\" recycling the Baton Rouge interpretation of the Bounce rhythm for an entirely new generation. Listen for the bassline and synth from Wipe Me Down and the chant style delivery almost 40 years after Drag Rap was created."
    },

    "Back That Azz Up": {
        "children": [],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 14,
        "year": 1999,
        "description": "\"Back That Azz Up\" is a track often credited for bringing New Orleans bounce into the national consciousness. Upon release in 1999, this song became inescapable in the club for much of the next decade, and is included in many DJ sets to this day. The Triggerman sample is present throughout the track, and you can hear the characteristic call and response of the Bounce genre in the chorus."
    },

    "Where Dey At": {
        "children": ["Clap For Em"],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 6,
        "year": 1991,
        "description": "Widely considered the first New Orleans Bounce track, this song marks the moment Triggerman becomes a distinct musical movement. At parties, DJ Irv would isolate and loop the Triggerman drums on repeat while MC T Tucker delivered call and response chants over the top. Listen for the live turntablism and the shift toward higher energy, dance oriented music."
    },

    "Clap For Em": {
        "children": [],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 35,
        "year": 2020,
        "description": "A victory lap for Bounce, \"Clap For Em\" is New Orleans artist Lil' Wayne's homage to the genre's biggest hits. This song directly samples not only \"Drag Rap\", but also directly samples \"Where Dey At\" and \"Back That Azz Up\" to pay respects to the lineage of the genre. Listen for the drums and accompaniment that constantly shift to reflect different tracks in the genre's history."
    },

    "Gangsta Walk": {
        "children": ["Explode"],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 3,
        "year": 1988,
        "description": "This is the crucial geographic bridge in our history, representing the earliest known example of \"Drag Rap\" taking root in the south. In the late 80s, DJ Spanish Fly adopted \"Drag Rap\", including the instrumental on his mixtapes and sampling it on a few of his songs. Soon, the so called Triggerman beat was the soundtrack to Memphis' signature gangster walk dance move. As you listen, notice the tempo shift. The crisp original instrumental is pitched down and made into something more muddy and hypnotic."
    },

    "Explode": {
        "children": ["Break My Soul"],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 29,
        "year": 2014,
        "description": "Coming out of the hypermasculinity of the Bounce genre in the late 90s/early 2000s, Big Freedia revolutionized the genre by bringing elements of queerness and femininity into its mainstream. After Hurricane Katrina in 2005, Big Freedia and other artists brought the sound of Bounce to Houston, where it influenced the music of artists like Beyoncé. Listen for all of the characteristics of modern bounce tracks, such as the use of call-and-response and choppy vocal loops."
    },

    "Break My Soul": {
        "children": [],
        "image": "https://images.genius.com/24cabdbec471fa5395717ed9c79d3e9a.499x506x1.jpg",
        "time": 37,
        "year": 2022,
        "description": "Though not a bounce track, Beyoncé's \"Break My Soul\" is a prime example of how the New Orleans Bounce genre has influenced the sound of music across the country. Bounce was introduced to Houston after Hurricane Katrina in 2005, and the genre has heavily shaped Beyoncé's sound. By directly sampling Big Freedia's \"Explode\", Beyoncé uses this track to highlight the importance of black queerness in club music."
    },
}


export class Songs {
    constructor() {
        this.data = data
    }

    preloadImages(canvas) {
        for (const songName in data) {

            const img = new Image();

            img.onload = () =>  {
                canvas.draw()
            }

            img.src = data[songName]["image"]
            data[songName]["image"] = img
        }

    }


}
