const express = require("express");
const multer = require("multer");

const app = express();
const upload = multer({ dest: "public/uploads" });

app.use(express.static("public")); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.set("view engine", "ejs"); 

let posts = [];
let nextId = 1;


posts = [
  { id: nextId++, name: "Alex Chen", year: "2025", club: "Film Club", thoughts: "Found my passion for documentary storytelling here. Our first screening changed everything!", image: null, x: 120, y: 180, width: 180, height: 180 },
  { id: nextId++, name: "Jordan Rivera", year: "2024", club: "Dance Ensemble", thoughts: "Late night rehearsals, new friends, and the feeling of performing on stage. Best decision I made at NYU.", image: null, x: 420, y: 250, width: 180, height: 180 },
  { id: nextId++, name: "Sam Williams", year: "2026", club: "Chess Club", thoughts: "Never thought I'd join a club, but these Tuesday meetings became the highlight of my week.", image: null, x: 200, y: 380, width: 180, height: 180 }
];

app.get("/", (request, response) => {
  response.render("index", { posts });
});

app.post("/submit", upload.single("image"), (req, res) => {
  let newPost = {
    id: nextId++,
    name: req.body.name || "Anonymous",
    year: req.body.year || "",
    club: req.body.club || "",
    thoughts: req.body.thoughts || "",
    x: parseInt(req.body.x, 10) || 100,
    y: parseInt(req.body.y, 10) || 100,
    width: 180,
    height: 180
  };

  if (req.file) {
    newPost.image = req.file.filename;
  } else {
    newPost.image = null;
  }

  posts.push(newPost);
  res.redirect("/");
});

app.get("/post/:id", (request, response) => {
  const id = parseInt(request.params.id, 10);
  const post = posts.find((p) => p.id === id);

  if (!post) {
    response.status(404).send("Post not found");
    return;
  }

  response.render("show", { post });
});

app.put("/post/:id/update", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const post = posts.find((p) => p.id === id);

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  const { x, y, width, height } = req.body;
  if (req.body.x !== undefined && !isNaN(parseInt(req.body.x, 10))) post.x = parseInt(req.body.x, 10);
  if (req.body.y !== undefined && !isNaN(parseInt(req.body.y, 10))) post.y = parseInt(req.body.y, 10);
  if (req.body.width !== undefined && !isNaN(parseInt(req.body.width, 10))) post.width = Math.max(120, Math.min(400, parseInt(req.body.width, 10)));
  if (req.body.height !== undefined && !isNaN(parseInt(req.body.height, 10))) post.height = Math.max(120, Math.min(500, parseInt(req.body.height, 10)));

  res.json({ ok: true });
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
