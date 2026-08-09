import { useState } from "react";
import { FaStar } from "react-icons/fa";

function CreateLink() {
  const [linkType, setLinkType] = useState("short");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [favourite, setFavourite] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      title,
      url,
      favourite,
      type: linkType,
    };

    console.log(data);
  };

  return (
    <div className="w-full px-6 py-6 md:px-6 md:py-6">
      <form
        onSubmit={handleSubmit}
        className="
          w-full
          mx-auto
          bg-zinc-900/80
          border border-zinc-800
          rounded-3xl
          px-5 py-5
          md:px-5 md:py-4
          shadow-xl
        "
      >
        {/* Short / Private */}
        <div className="flex justify-center mb-5">
          <div className="flex bg-zinc-950 border border-zinc-800 rounded-full p-1">
            <button
              type="button"
              onClick={() => setLinkType("short")}
              className={`
                px-5 py-1.5
                rounded-full
                text-sm
                transition-all
                ${
                  linkType === "short"
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }
              `}
            >
              Short Link
            </button>

            <button
              type="button"
              onClick={() => setLinkType("private")}
              className={`
                px-5 py-1.5
                rounded-full
                text-sm
                transition-all
                ${
                  linkType === "private"
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }
              `}
            >
              Private Link
            </button>
          </div>
          
        </div>
        
        {/* Inputs */}
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Title */}
          <div className="flex-1">
            <label className="block text-xs text-zinc-100 mb-1.5 ml-3">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="
                w-full
                h-11
                px-5
                rounded-full
                bg-zinc-950
                border border-zinc-800
                text-sm
                text-white
                placeholder:text-zinc-600
                outline-none
                focus:border-rose-400/70
                focus:ring-2
                focus:ring-rose-400/10
              "
            />
          </div>

          {/* URL */}
          <div className="flex-2">
            <label className="block text-xs text-zinc-100 mb-1.5 ml-3">
              URL
            </label>

            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/..."
                className="
                  w-full
                  h-11
                  pl-5
                  pr-14
                  rounded-full
                  bg-zinc-950
                  border border-zinc-800
                  text-sm
                  text-white
                  placeholder:text-zinc-600
                  outline-none
                  focus:border-rose-400/70
                  focus:ring-2
                  focus:ring-rose-400/10
                "
              />

              {/* Favourite */}
              <button
                type="button"
                onClick={() => setFavourite(!favourite)}
                aria-label="Favourite"
                className="
                  absolute
                  right-2
                  top-1/2
                  -translate-y-1/2
                  w-8
                  h-8
                  rounded-full
                  flex
                  items-center
                  justify-center
                  hover:bg-zinc-800
                  transition-all
                  active:scale-90
                "
              >
                <FaStar
                  className={
                    favourite
                      ? "text-yellow-400"
                      : "text-zinc-600"
                  }
                />
              </button>
            </div>
          </div>
        </div>

        {/* Add Link */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="
              w-full
              md:w-auto
              h-10
              px-7
              rounded-full
              bg-rose-500
              hover:bg-rose-600
              active:scale-95
              text-sm
              font-medium
              text-white
              transition-all
            "
          >
            Add Link
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateLink;