# How to write a new blog post (easy guide)

Writing a post takes about 5 minutes. No coding knowledge needed — just
copy a file, change some words, and add one link. Follow these steps.

---

## Step 1 — Make a copy of the template

In the `blog/` folder there is a file called **`_template.html`**.

- Make a **copy** of it.
- **Rename** the copy to your post's web address (called a "slug"). Use only
  lowercase letters and dashes — no spaces.

Example: a post titled *"My First Data Project"* → name the file
**`my-first-data-project.html`**

> Tip: the file name becomes the link, e.g. `example.com/blog/my-first-data-project.html`

---

## Step 2 — Fill in the blanks

Open your new file. Anything written like `{{THIS}}` (with curly brackets) is a
blank for you to fill in. Replace each one:

| Blank | What to put |
|-------|-------------|
| `{{POST_TITLE}}` | The title of your post |
| `{{POST_DESCRIPTION}}` | One sentence describing the post (used for Google + link previews) |
| `{{SLUG}}` | The file name **without** `.html` (e.g. `my-first-data-project`) |
| `{{DATE ...}}` | The date, like `Jun 6, 2026` |
| `{{N}} min read` | Rough reading time, like `4 min read` |
| `{{TAG_1}}` / `{{TAG_2}}` | One or two short topic tags, like `Data` or `AI` |

Then write your actual post inside the part that says
`<div class="post-content"> ... </div>`. (More on writing below.)

---

## Step 3 — Remove the "hidden from Google" line

Near the top of your file there is this line:

```html
<meta name="robots" content="noindex">
```

**Delete it.** (It exists only so the template itself stays out of search
results. Your real post should be found by Google, so remove it.)

You can also delete the big comment block at the very top of the file — it's
just instructions.

---

## Step 4 — Add your post to the blog list

Open **`blog/index.html`**. Find the section that starts with
`<div class="post-list">`. Copy one existing `<a class="post-card"> ... </a>`
block and paste it at the **top** of the list (newest posts go first). Then
change its words to match your new post, and set the link:

```html
<a href="my-first-data-project.html" class="post-card reveal">
    <div class="post-card-meta">
        <span class="post-card-date">Jun 6, 2026</span>
        <span class="post-card-readtime">4 min read</span>
    </div>
    <h2 class="post-card-title">My First Data Project</h2>
    <p class="post-card-dek">A short one-line summary that makes people want to click.</p>
    <div class="post-card-tags">
        <span class="tag">Data</span>
    </div>
    <span class="post-card-arrow" aria-hidden="true">Read →</span>
</a>
```

Make sure the `href="..."` matches your file name from Step 1.

---

## Step 5 — (Optional) add it to the sitemap

This helps Google find the post faster. Open **`sitemap.xml`** (in the main
folder) and copy an existing `<url> ... </url>` block, then change the address:

```xml
<url>
  <loc>https://example.com/blog/my-first-data-project.html</loc>
  <lastmod>2026-06-06</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.5</priority>
</url>
```

---

## Step 6 — Publish

Save everything, then upload/commit the changes to GitHub. The site updates by
itself in a minute or two. Done! 🎉

---

## Writing the post body (the building blocks)

Inside `<div class="post-content">`, use these simple tags:

| You want… | Write this |
|-----------|------------|
| A normal paragraph | `<p>Your text here.</p>` |
| A big section heading | `<h2>Section title</h2>` |
| A smaller heading | `<h3>Smaller title</h3>` |
| **Bold** words | `<strong>important</strong>` |
| A link | `<a href="https://...">link text</a>` |
| A bullet list | `<ul><li>first</li><li>second</li></ul>` |
| A quote | `<blockquote>A memorable line.</blockquote>` |
| A bit of code | `<code>SELECT * FROM data</code>` |
| A picture | `<img src="../assets/images/your-image.webp" width="800" height="450" alt="describe it">` |

That's all you need. When unsure, open the existing post
`building-this-site-with-ai.html` and copy how it's written.
