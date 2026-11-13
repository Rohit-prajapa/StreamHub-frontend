import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
  useOutletContext,
} from "react-router-dom";
import {
  Search,
  Video,
  Plus,
  House,
  Compass,
  LayoutDashboard,
  LogOut,
  ThumbsUp,
  UploadCloud,
  UserCircle,
  Play,
  MessageCircle,
  Users,
  ListVideo,
} from "lucide-react";
import { api, data, arr, msg } from "./api";
function Shell() {
  const [user, setUser] = useState(null),
    [q, setQ] = useState(""),
    nav = useNavigate();
  useEffect(() => {
    api
      .get("/users/current-user")
      .then((r) => setUser(data(r)?.user || data(r)))
      .catch(() => {});
  }, []);
  async function logout() {
    try {
      await api.post("/users/logout");
    } catch {}
    setUser(null);
    nav("/");
  }
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex h-[70px] max-w-[1600px] items-center gap-4 px-4 sm:px-7">
          <Link to="/" className="flex items-center gap-2 text-lg font-black">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-black">
              <Video />
            </span>
            stream<span className="text-accent">hub</span>
          </Link>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              nav("/?q=" + encodeURIComponent(q));
            }}
            className="mx-auto hidden w-full max-w-xl items-center rounded-full border border-zinc-700 bg-zinc-900 px-4 sm:flex"
          >
            <Search size={17} />
            <input
              className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
              placeholder="Search videos and creators"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </form>
          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/upload"
                  className="btn secondary hidden sm:inline-flex"
                >
                  <Plus size={16} />
                  Create
                </Link>
                <Link to="/profile" className="flex items-center gap-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle />
                  )}
                  <span className="hidden text-sm sm:block">
                    {user.username}
                  </span>
                </Link>
                <button onClick={logout} className="p-2 text-zinc-400">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link className="btn primary" to="/login">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="sticky top-[70px] hidden h-[calc(100vh-70px)] w-60 shrink-0 border-r border-zinc-800 p-4 lg:block">
          <nav className="space-y-2">
            {[
              ["/", House, "Home"],
              ["/explore", Compass, "Explore"],
              ["/playlists", ListVideo, "Playlists"],
              ["/dashboard", LayoutDashboard, "Creator studio"],
            ].map(([to, I, t]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm " +
                  (isActive
                    ? "bg-zinc-800 text-accent"
                    : "text-zinc-400 hover:bg-zinc-900")
                }
              >
                <I size={18} />
                {t}
              </NavLink>
            ))}
          </nav>
          <div className="mt-10 rounded-2xl border border-zinc-800 bg-panel p-4">
            <p className="font-bold">Ready to create?</p>
            <p className="my-2 text-xs text-zinc-500">
              Share your videos with the community.
            </p>
            <Link
              to={user ? "/upload" : "/login"}
              className="btn primary w-full"
            >
              Upload video
            </Link>
          </div>
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet context={{ user, setUser }} />
        </main>
      </div>
      <nav className="fixed bottom-0 z-30 grid w-full grid-cols-4 border-t border-zinc-800 bg-ink px-2 py-2 lg:hidden">
        {[
          ["/", House, "Home"],
          ["/explore", Compass, "Explore"],
          ["/upload", Plus, "Create"],
          ["/profile", UserCircle, "Profile"],
        ].map(([to, I, t]) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-1 py-1 text-[10px] text-zinc-400"
          >
            <I size={19} />
            {t}
          </Link>
        ))}
      </nav>
    </>
  );
}
function Home() {
  const [v, setV] = useState(null),
    [likeCount, setLikeCount] = useState(0),
    [isLiked, setIsLiked] = useState(false),
    [err, setErr] = useState(""),
    [loading, setLoading] = useState(true),
    [sp] = useSearchParams();
  const q = sp.get("q") || "";
  useEffect(() => {
    setLoading(true);
    api
      .get("/videos", {
        params: {
          page: 1,
          limit: 30,
          query: q || undefined,
          sortBy: "createdAt",
          sortType: -1,
        },
      })
      .then((r) => setV(arr(data(r))))
      .catch((e) => setErr(msg(e)))
      .finally(() => setLoading(false));
  }, [q]);
  return (
    <div className="wrap">
      <section className="mb-8 rounded-3xl border border-zinc-800 bg-gradient-to-br from-lime-950 via-zinc-900 to-zinc-950 p-8 sm:p-11">
        <p className="mb-3 text-xs font-bold tracking-[.2em] text-accent">
          YOUR VIDEO COMMUNITY
        </p>
        <h1 className="text-4xl font-black sm:text-5xl">
          Ideas worth <span className="text-accent">watching.</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-zinc-400">
          Discover creators, explore fresh perspectives, and share what you
          love.
        </p>
      </section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">
            {q ? "Search results" : "Recommended videos"}
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Fresh videos from the community
          </p>
        </div>
        <Link to="/upload" className="btn secondary">
          <Plus size={16} />
          Upload
        </Link>
      </div>
      {err && <p className="mb-4 text-sm text-red-400">{err}</p>}
      {loading ? <p className="muted">Loading videos…</p> : <Grid videos={v} />}
    </div>
  );
}
function Grid({ videos = [] }) {
  return videos.length ? (
    <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {videos.map((v) => (
        <article key={v._id}>
          <Link
            to={"/watch/" + v._id}
            className="relative block aspect-video overflow-hidden rounded-2xl bg-zinc-900"
          >
            <img
              src={
                v.thumbnail ||
                "https://placehold.co/640x360/18181b/ffffff?text=Video"
              }
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs">
              {Math.floor((v.duration || 0) / 60)}:
              {String(Math.floor((v.duration || 0) % 60)).padStart(2, "0")}
            </span>
          </Link>
          <div className="flex gap-3 pt-3">
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-zinc-800">
              {v.owner?.avatar && (
                <img
                  src={v.owner.avatar}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0">
              <Link
                to={"/watch/" + v._id}
                className="line-clamp-2 text-sm font-bold hover:text-accent"
              >
                {v.title}
              </Link>
              <p className="mt-1 text-xs text-zinc-500">
                {v.owner?.fullName || v.owner?.username || "Creator"}
              </p>
              <p className="text-xs text-zinc-600">{v.views || 0} views</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  ) : (
    <div className="card p-12 text-center text-zinc-500">
      No videos found yet. Upload the first one!
    </div>
  );
}
function Auth({ register = false }) {
  const [form, setForm] = useState({
      fullName: "",
      username: "",
      email: "",
      password: "",
    }),
    [avatar, setAvatar] = useState(null),
    [cover, setCover] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    nav = useNavigate();
  const { setUser } = useOutletContext();
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (register) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (avatar) fd.append("avatar", avatar);
        if (cover) fd.append("coverImage", cover);
        await api.post("/users/register", fd);
      }
      const r = await api.post("/users/login", {
        email: form.email,
        username: form.username,
        password: form.password,
      });
      setUser(data(r)?.user || data(r));
      nav("/");
    } catch (e) {
      setError(msg(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="wrap grid min-h-[75vh] place-items-center">
      <form
        onSubmit={submit}
        className="card w-full max-w-lg space-y-4 p-7 sm:p-10"
      >
        <p className="text-xs font-bold tracking-widest text-accent">
          STREAMHUB ACCOUNT
        </p>
        <h1 className="text-3xl font-black">
          {register ? "Create your account" : "Welcome back"}
        </h1>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {register && (
          <>
            <input
              className="field"
              placeholder="Full name"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              className="field"
              placeholder="Username"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <label className="block text-xs text-zinc-400">
              Avatar
              <input
                type="file"
                accept="image/*"
                required
                className="mt-2 block"
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </label>
            <label className="block text-xs text-zinc-400">
              Cover image (optional)
              <input
                type="file"
                accept="image/*"
                className="mt-2 block"
                onChange={(e) => setCover(e.target.files[0])}
              />
            </label>
          </>
        )}
        <input
          className="field"
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="field"
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn primary w-full" disabled={busy}>
          {busy ? "Please wait…" : register ? "Create account" : "Sign in"}
        </button>
        <p className="text-center text-sm text-zinc-500">
          {register ? "Already registered?" : "New here?"}{" "}
          <Link className="text-accent" to={register ? "/login" : "/register"}>
            {register ? "Sign in" : "Create account"}
          </Link>
        </p>
      </form>
    </div>
  );
}

function Watch() {
  const { id } = useParams();

  const [v, setV] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/videos/" + id),
      api.get("/comments/" + id, {
        params: { page: 1, limit: 30 },
      }),
    ])
      .then(([a, b]) => {
        setV(data(a)?.video || data(a));
        setComments(arr(data(b)));
      })
      .catch((e) => setError(msg(e)));
  }, [id]);

  async function comment(e) {
    e.preventDefault();

    try {
      const r = await api.post("/comments/" + id, {
        content: text,
      });

      setComments([data(r)?.comment || data(r), ...comments]);

      setText("");
    } catch (e) {
      setError(msg(e));
    }
  }

  async function like() {
    try {
      const r = await api.post("/likes/toggle/v/" + id);
      const result = data(r);

      setIsLiked(result.isLiked);
      setLikeCount(result.likeCount);
    } catch (e) {
      setError(msg(e));
    }
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Video link copied!");
    } catch {
      setError("Unable to copy video link.");
    }
  }

  if (!v) {
    return <div className="wrap">{error || "Loading video..."}</div>;
  }

  return (
    <div className="wrap">
      <div className="grid gap-8 2xl:grid-cols-[1fr_320px]">
        <div>
          <video
            controls
            poster={v.thumbnail}
            src={v.videoFile}
            className="aspect-video w-full rounded-2xl bg-black"
          />

          <h1 className="mt-5 text-2xl font-black">{v.title}</h1>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-5">
            <Link to={"/channel/" + (v.owner?._id || "")} className="font-bold">
              {v.owner?.fullName || v.owner?.username || "Creator"}
            </Link>

            <div className="flex gap-2">
              <button
                onClick={like}
                className={`btn ${isLiked ? "primary" : "secondary"}`}
              >
                <ThumbsUp size={16} />
                {isLiked ? "Liked" : "Like"} ({likeCount})
              </button>

              <button className="btn secondary" onClick={share}>
                Share
              </button>
            </div>
          </div>

          <p className="mt-4 rounded-xl bg-zinc-900 p-4 text-sm text-zinc-300">
            {v.views || 0} views
            <br />
            <br />
            {v.description}
          </p>

          <section className="mt-8">
            <h2 className="mb-4 text-lg font-bold">
              Comments ({comments.length})
            </h2>

            <form onSubmit={comment} className="mb-6 flex gap-2">
              <input
                className="field"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a comment..."
                required
              />

              <button className="btn primary">Send</button>
            </form>

            {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c._id} className="border-b border-zinc-800 pb-3">
                  <p className="text-xs font-bold">
                    {c.owner?.username || "User"}
                  </p>

                  <p className="mt-1 text-sm text-zinc-300">{c.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Upload() {
  const [title, setTitle] = useState(""),
    [description, setDescription] = useState(""),
    [video, setVideo] = useState(null),
    [thumb, setThumb] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    nav = useNavigate();
  async function submit(e) {
    e.preventDefault();
    const f = new FormData();
    f.append("title", title);
    f.append("description", description);
    f.append("videoFile", video);
    f.append("thumbnail", thumb);
    setBusy(true);
    try {
      const r = await api.post("/videos", f);
      const v = data(r)?.video || data(r);
      nav(v ? "/watch/" + v._id : "/dashboard");
    } catch (e) {
      setError(msg(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="wrap max-w-3xl">
      <h1 className="mb-2 text-3xl font-black">Upload a video</h1>
      <p className="mb-7 text-sm text-zinc-500">
        Publish your next video to StreamHub.
      </p>
      <form onSubmit={submit} className="card space-y-5 p-6">
        <label className="block text-sm">
          Title
          <input
            className="field mt-2"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          Description
          <textarea
            className="field mt-2 min-h-32"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          Video file
          <input
            className="mt-2 block w-full text-xs"
            type="file"
            accept="video/*"
            required
            onChange={(e) => setVideo(e.target.files[0])}
          />
        </label>
        <label className="block text-sm">
          Thumbnail
          <input
            className="mt-2 block w-full text-xs"
            type="file"
            accept="image/*"
            required
            onChange={(e) => setThumb(e.target.files[0])}
          />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          disabled={busy || !video || !thumb}
          className="btn primary w-full"
        >
          <UploadCloud size={17} />
          {busy ? "Uploading…" : "Publish video"}
        </button>
      </form>
    </div>
  );
}
function Dashboard() {
  const [s, setS] = useState({}),
    [v, setV] = useState([]),
    [error, setError] = useState("");
  useEffect(() => {
    Promise.all([
      api.get("/dashboard/stats"),
      api.get("/dashboard/videos", { params: { page: 1, limit: 30 } }),
    ])
      .then(([a, b]) => {
        setS(data(a) || {});
        setV(arr(data(b)));
      })
      .catch((e) => setError(msg(e)));
  }, []);
  return (
    <div className="wrap">
      <div className="mb-7 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold tracking-widest text-accent">
            CREATOR STUDIO
          </p>
          <h1 className="mt-2 text-3xl font-black">Dashboard</h1>
        </div>
        <Link to="/upload" className="btn primary">
          <Plus />
          Upload
        </Link>
      </div>
      {error && <p className="mb-4 text-red-400">{error}</p>}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Videos", s.totalVideos || 0, Video],
          ["Views", s.totalViews || 0, Play],
          ["Subscribers", s.totalSubscribers || 0, Users],
          ["Likes", s.totalLikes || 0, ThumbsUp],
        ].map(([t, n, I]) => (
          <div className="card p-5" key={t}>
            <I className="text-accent" />
            <p className="mt-4 text-sm text-zinc-500">{t}</p>
            <p className="text-3xl font-black">{n}</p>
          </div>
        ))}
      </div>
      <h2 className="mb-4 text-xl font-bold">Your videos</h2>
      <div className="card divide-y divide-zinc-800">
        {v.map((x) => (
          <div key={x._id} className="flex items-center gap-4 p-4">
            <img
              src={x.thumbnail}
              className="h-16 w-28 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{x.title}</p>
              <p className="text-xs text-zinc-500">
                {x.views || 0} views ·{" "}
                {x.isPublished ? "Published" : "Unpublished"}
              </p>
            </div>
            <button
              className="btn secondary text-xs"
              onClick={() =>
                api
                  .patch("/videos/toggle/publish/" + x._id)
                  .then(() =>
                    setV(
                      v.map((y) =>
                        y._id === x._id
                          ? { ...y, isPublished: !y.isPublished }
                          : y,
                      ),
                    ),
                  )
              }
            >
              {x.isPublished ? "Unpublish" : "Publish"}
            </button>
          </div>
        ))}
        {!v.length && (
          <p className="p-8 text-center text-zinc-500">No uploads yet.</p>
        )}
      </div>
    </div>
  );
}
function Playlists() {
  const { user } = useOutletContext();
  const [items, setItems] = useState([]),
    [name, setName] = useState(""),
    [description, setDescription] = useState(""),
    [err, setErr] = useState("");
  const load = () =>
    api
      .get("/playlists/user/" + user?._id)
      .then((r) => setItems(arr(data(r))))
      .catch((e) => setErr(msg(e)));
  useEffect(() => {
    if (user?._id) load();
  }, [user?._id]);
  async function create(e) {
    e.preventDefault();
    try {
      await api.post("/playlists", { name, description });
      setName("");
      setDescription("");
      load();
    } catch (e) {
      setErr(msg(e));
    }
  }
  return (
    <div className="wrap">
      <h1 className="mb-6 text-3xl font-black">Playlists</h1>
      <form
        onSubmit={create}
        className="card mb-7 grid gap-3 p-5 sm:grid-cols-3"
      >
        <input
          className="field"
          placeholder="Playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="field"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button className="btn primary">Create playlist</button>
      </form>
      {err && <p className="mb-3 text-sm text-red-400">{err}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((p) => (
          <Link to={"/playlists/" + p._id} key={p._id} className="card p-5">
            <ListVideo className="mb-5 text-accent" size={30} />
            <b>{p.name}</b>
            <p className="mt-2 text-sm text-zinc-500">{p.description}</p>
            <p className="mt-2 text-xs text-zinc-600">
              {p.videos?.length || 0} videos
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
function Playlist() {
  const { id } = useParams(),
    [p, setP] = useState(null);
  useEffect(() => {
    api
      .get("/playlists/" + id)
      .then((r) => setP(data(r)?.playlist || data(r)))
      .catch(() => {});
  }, [id]);
  return (
    <div className="wrap">
      <h1 className="mb-2 text-3xl font-black">{p?.name || "Playlist"}</h1>
      <p className="mb-7 text-sm text-zinc-500">{p?.description}</p>
      <Grid videos={(p?.videos || []).filter((x) => typeof x === "object")} />
    </div>
  );
}
function Channel() {
  const { id } = useParams(),
    [videos, setVideos] = useState([]),
    [owner, setOwner] = useState(null),
    [subs, setSubs] = useState(0),
    [err, setErr] = useState("");
  useEffect(() => {
    api
      .get("/videos", { params: { userId: id, limit: 30 } })
      .then((r) => {
        const a = arr(data(r));
        setVideos(a);
        setOwner(a[0]?.owner);
      })
      .catch((e) => setErr(msg(e)));
    api
      .get("/subscriptions/u/" + id)
      .then((r) => setSubs(arr(data(r)).length))
      .catch(() => {});
  }, [id]);
  async function sub() {
    try {
      await api.post("/subscriptions/c/" + id);
      setSubs((n) => n + 1);
    } catch (e) {
      setErr(msg(e));
    }
  }
  return (
    <div className="wrap">
      <div className="card mb-8 overflow-hidden">
        <div className="h-36 bg-gradient-to-r from-lime-950 to-zinc-900" />
        <div className="p-6">
          <h1 className="text-2xl font-black">
            {owner?.fullName || owner?.username || "Creator channel"}
          </h1>
          <p className="text-sm text-zinc-500">
            @{owner?.username || "creator"} · {subs} subscribers
          </p>
          <button onClick={sub} className="btn primary mt-4">
            Subscribe
          </button>
        </div>
      </div>
      {err && <p className="mb-4 text-red-400">{err}</p>}
      <Grid videos={videos} />
    </div>
  );
}
function Profile() {
  const { user } = useOutletContext();
  return (
    <div className="wrap">
      <h1 className="mb-5 text-3xl font-black">Your channel</h1>
      <div className="card flex items-center gap-5 p-6">
        {user?.avatar && (
          <img
            src={user.avatar}
            className="h-20 w-20 rounded-full object-cover"
          />
        )}
        <div>
          <h2 className="text-xl font-bold">
            {user?.fullName || user?.username || "Signed in"}
          </h2>
          <p className="text-sm text-zinc-500">@{user?.username}</p>
          <Link
            to="/dashboard"
            className="mt-3 inline-block text-sm text-accent"
          >
            Open creator dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
function NotFound() {
  return (
    <div className="wrap py-24 text-center">
      <h1 className="text-6xl font-black text-accent">404</h1>
      <p className="my-4 text-zinc-400">Page not found</p>
      <Link to="/" className="btn primary">
        Go home
      </Link>
    </div>
  );
}
export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="explore" element={<Home />} />
        <Route path="login" element={<Auth />} />
        <Route path="register" element={<Auth register />} />
        <Route path="watch/:id" element={<Watch />} />
        <Route path="channel/:id" element={<Channel />} />
        <Route path="upload" element={<Upload />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="playlists" element={<Playlists />} />
        <Route path="playlists/:id" element={<Playlist />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
