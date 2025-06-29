import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { WebsimSocket, useQuery } from "@websim/use-query";
import { create } from "zustand";
const room = new WebsimSocket();
const useStore = create((set) => ({
  selectedImageId: null,
  setSelectedImageId: (id) => set({ selectedImageId: id })
}));
const timeSteps = [
  { value: 0, label: "0 days" },
  { value: 1, label: "1 day" },
  { value: 2, label: "3 days" },
  { value: 3, label: "1 week" },
  { value: 4, label: "2 weeks" },
  { value: 5, label: "1 month" },
  { value: 6, label: "6 months" },
  { value: 7, label: "1 year" },
  { value: 8, label: "10 years" },
  { value: 9, label: "50 years" },
  { value: 10, label: "100 years" },
  { value: 11, label: "500 years" },
  { value: 12, label: "1 millennium" },
  { value: 13, label: "10 millennia" },
  { value: 14, label: "100 millennia" }
];
const LoadingSpinner = ({ text = "Loading..." }) => /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center justify-center space-y-2", children: [
  /* @__PURE__ */ jsxDEV("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 34,
    columnNumber: 9
  }),
  /* @__PURE__ */ jsxDEV("p", { className: "text-gray-300", children: text }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 35,
    columnNumber: 9
  })
] }, void 0, true, {
  fileName: "<stdin>",
  lineNumber: 33,
  columnNumber: 5
});
function BaseImageGenerator({ onGenerationComplete }) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const generateImage = async () => {
    if (!prompt) {
      setError("Please enter a prompt.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const imageResult = await websim.imageGen({ prompt, aspect_ratio: "16:9" });
      const imageUrl = imageResult.url;
      const descCompletion = await websim.chat.completions.create({
        messages: [{
          role: "user",
          content: [
            { type: "text", text: "Describe this image in a detailed paragraph. Focus on objects, the environment, materials, and the overall mood." },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }]
      });
      const description = descCompletion.content;
      const newImageRecord = await room.collection("base_images_v1").create({
        prompt,
        image_url: imageUrl,
        description
      });
      setPrompt("");
      onGenerationComplete(newImageRecord.id);
    } catch (e) {
      console.error(e);
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-800 p-4 rounded-lg shadow-lg mb-8", children: [
    /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold mb-4 text-white", children: "Create a New Base Image" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 88,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row gap-2", children: [
      /* @__PURE__ */ jsxDEV(
        "input",
        {
          type: "text",
          value: prompt,
          onChange: (e) => setPrompt(e.target.value),
          placeholder: "e.g., A futuristic city skyline at sunset",
          className: "flex-grow bg-gray-700 text-white placeholder-gray-400 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500",
          disabled: isLoading
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 90,
          columnNumber: 17
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: generateImage,
          disabled: isLoading,
          className: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors",
          children: isLoading ? /* @__PURE__ */ jsxDEV(LoadingSpinner, { text: "Generating..." }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 103,
            columnNumber: 34
          }, this) : "Generate"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 98,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 89,
      columnNumber: 13
    }, this),
    error && /* @__PURE__ */ jsxDEV("p", { className: "text-red-400 mt-2", children: error }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 106,
      columnNumber: 23
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 87,
    columnNumber: 9
  }, this);
}
function ImageGallery() {
  const { data: images, loading } = useQuery(room.collection("base_images_v1").orderBy("created_at", "desc"));
  const setSelectedImageId = useStore((state) => state.setSelectedImageId);
  if (loading && !images) return /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: /* @__PURE__ */ jsxDEV(LoadingSpinner, { text: "Loading gallery..." }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 115,
    columnNumber: 65
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 115,
    columnNumber: 36
  }, this);
  if (!images || images.length === 0) return /* @__PURE__ */ jsxDEV("p", { className: "text-center text-gray-400", children: "No base images yet. Generate one to start!" }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 116,
    columnNumber: 48
  }, this);
  return /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: images.map((image) => /* @__PURE__ */ jsxDEV("div", { className: "cursor-pointer group relative", onClick: () => setSelectedImageId(image.id), children: [
    /* @__PURE__ */ jsxDEV("img", { src: image.image_url, alt: image.prompt, className: "w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 122,
      columnNumber: 21
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg", children: /* @__PURE__ */ jsxDEV("p", { className: "text-white text-center p-2 text-sm", children: image.prompt }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 124,
      columnNumber: 25
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 123,
      columnNumber: 21
    }, this)
  ] }, image.id, true, {
    fileName: "<stdin>",
    lineNumber: 121,
    columnNumber: 17
  }, this)) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 119,
    columnNumber: 9
  }, this);
}
function FutureImageView({ imageId }) {
  const setSelectedImageId = useStore((state) => state.setSelectedImageId);
  const { data: images, loading: imageLoading } = useQuery(room.collection("base_images_v1").filter({ id: imageId }));
  const baseImage = images && images[0];
  const { data: futureImages, loading: futureImagesLoading } = useQuery(
    baseImage ? room.collection("future_images_v1").filter({ base_image_id: baseImage.id }).orderBy("created_at", "desc") : null
  );
  const [sliderValue, setSliderValue] = useState(7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [futureImageResult, setFutureImageResult] = useState(null);
  const generateFutureImage = async () => {
    if (!baseImage) return;
    setIsGenerating(true);
    setError(null);
    setFutureImageResult(null);
    const timeLabel = timeSteps.find((t) => t.value === sliderValue)?.label || "an unknown amount of time";
    try {
      const futureDescCompletion = await websim.chat.completions.create({
        messages: [{
          role: "system",
          content: "You are a master of speculative science and history. Your task is to describe how a scene changes over vast periods of time. Be vivid, detailed, and creative, considering decay, growth, erosion, technological advancement, or cosmic events."
        }, {
          role: "user",
          content: `The following is a description of a scene: "${baseImage.description}". Now, describe in a new, highly detailed paragraph what this exact scene would look like after ${timeLabel} has passed. Focus on the transformation of materials, the evolution of life, and the changing environment.`
        }]
      });
      const futureDescription = futureDescCompletion.content;
      const futureImageResult2 = await websim.imageGen({ prompt: futureDescription, aspect_ratio: "16:9" });
      const newFutureImage = await room.collection("future_images_v1").create({
        base_image_id: baseImage.id,
        future_image_url: futureImageResult2.url,
        time_delta_description: timeLabel,
        future_prompt: futureDescription
      });
      setFutureImageResult(newFutureImage);
    } catch (e) {
      console.error(e);
      setError("Failed to generate future image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  if (imageLoading) return /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: /* @__PURE__ */ jsxDEV(LoadingSpinner, { text: "Loading image..." }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 185,
    columnNumber: 59
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 185,
    columnNumber: 30
  }, this);
  if (!baseImage) return /* @__PURE__ */ jsxDEV("div", { className: "text-center text-red-400", children: [
    "Image not found. ",
    /* @__PURE__ */ jsxDEV("button", { onClick: () => setSelectedImageId(null), className: "underline", children: "Return to gallery." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 186,
      columnNumber: 87
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 186,
    columnNumber: 28
  }, this);
  const selectedTimeLabel = timeSteps.find((t) => t.value === sliderValue)?.label;
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-800 p-6 rounded-lg shadow-2xl", children: [
    /* @__PURE__ */ jsxDEV("button", { onClick: () => setSelectedImageId(null), className: "mb-4 text-blue-400 hover:text-blue-300", children: [
      /* @__PURE__ */ jsxDEV("i", { className: "fas fa-arrow-left mr-2" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 192,
        columnNumber: 113
      }, this),
      "Back to Gallery"
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 192,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-bold text-white mb-2", children: "Base Image" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 195,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("img", { src: baseImage.image_url, alt: baseImage.prompt, className: "w-full rounded-lg shadow-lg" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 196,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-gray-400 mt-2 italic", children: [
          '"',
          baseImage.prompt,
          '"'
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 197,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-gray-300 mt-4", children: baseImage.description }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 198,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 194,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-bold text-white mb-2", children: "Future Projection" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 201,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-700 p-4 rounded-lg", children: [
          /* @__PURE__ */ jsxDEV("label", { htmlFor: "time-slider", className: "block text-lg font-medium text-white mb-2", children: [
            "Time into the future: ",
            /* @__PURE__ */ jsxDEV("span", { className: "font-bold text-blue-400", children: selectedTimeLabel }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 203,
              columnNumber: 130
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 203,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: "time-slider",
              type: "range",
              min: "0",
              max: timeSteps.length - 1,
              value: sliderValue,
              onChange: (e) => setSliderValue(parseInt(e.target.value)),
              className: "w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 204,
              columnNumber: 25
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between text-xs text-gray-400 mt-1", children: timeSteps.map((step, index) => /* @__PURE__ */ jsxDEV("span", { className: "w-1/14 text-center", children: "|" }, index, false, {
            fileName: "<stdin>",
            lineNumber: 215,
            columnNumber: 32
          }, this)) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 213,
            columnNumber: 26
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: generateFutureImage,
              disabled: isGenerating,
              className: "w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors",
              children: isGenerating ? "Generating Future..." : "Generate Future Image"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 218,
              columnNumber: 26
            },
            this
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 202,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "mt-4 flex-grow flex items-center justify-center bg-gray-900 rounded-lg p-4 min-h-[200px]", children: [
          isGenerating && /* @__PURE__ */ jsxDEV(LoadingSpinner, { text: "The sands of time are shifting..." }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 227,
            columnNumber: 42
          }, this),
          error && /* @__PURE__ */ jsxDEV("p", { className: "text-red-400 text-center", children: error }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 228,
            columnNumber: 35
          }, this),
          futureImageResult && /* @__PURE__ */ jsxDEV("img", { src: futureImageResult.future_image_url, className: "w-full rounded-lg" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 229,
            columnNumber: 47
          }, this),
          !isGenerating && !futureImageResult && /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500", children: "Your generated future image will appear here." }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 230,
            columnNumber: 65
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 226,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 200,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 193,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "mt-8", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-bold text-white mb-4", children: "History of this timeline" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 235,
        columnNumber: 18
      }, this),
      futureImagesLoading && /* @__PURE__ */ jsxDEV("p", { className: "text-gray-400", children: "Loading history..." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 236,
        columnNumber: 42
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 max-h-96 overflow-y-auto pr-2", children: [
        futureImages && futureImages.map((img) => /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-700 p-3 rounded-lg flex items-start gap-4", children: [
          /* @__PURE__ */ jsxDEV("img", { src: img.future_image_url, className: "w-32 h-20 object-cover rounded" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 240,
            columnNumber: 28
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("p", { className: "font-bold text-white", children: img.time_delta_description }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 242,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-300 line-clamp-2", children: img.future_prompt }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 243,
              columnNumber: 33
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 241,
            columnNumber: 28
          }, this)
        ] }, img.id, true, {
          fileName: "<stdin>",
          lineNumber: 239,
          columnNumber: 25
        }, this)),
        futureImages && futureImages.length === 0 && /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500", children: "No futures generated for this image yet." }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 247,
          columnNumber: 67
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 237,
        columnNumber: 18
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 234,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 191,
    columnNumber: 9
  }, this);
}
function App() {
  const { selectedImageId, setSelectedImageId } = useStore();
  const handleGenerationComplete = (newId) => {
    setSelectedImageId(newId);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-900 text-gray-200 min-h-screen p-4 sm:p-8 font-sans", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxDEV("header", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxDEV("h1", { className: "text-4xl sm:text-5xl font-extrabold text-white tracking-tight", children: [
        "Future",
        /* @__PURE__ */ jsxDEV("span", { className: "text-blue-500", children: "Vision" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 265,
          columnNumber: 105
        }, this),
        " AI"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 265,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "mt-2 text-lg text-gray-400", children: "Generate an image and see how it transforms over millennia." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 266,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 264,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("main", { children: selectedImageId ? /* @__PURE__ */ jsxDEV(FutureImageView, { imageId: selectedImageId }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 271,
      columnNumber: 25
    }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(BaseImageGenerator, { onGenerationComplete: handleGenerationComplete }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 274,
        columnNumber: 29
      }, this),
      /* @__PURE__ */ jsxDEV(ImageGallery, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 275,
        columnNumber: 29
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 273,
      columnNumber: 25
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 269,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 263,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 262,
    columnNumber: 9
  }, this);
}
const root = createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
  fileName: "<stdin>",
  lineNumber: 285,
  columnNumber: 13
}));
