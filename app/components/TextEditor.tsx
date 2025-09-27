"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  Link as LinkIcon,
  Type,
  Heading1,
  Heading2,
  Quote
} from "lucide-react";

interface TextEditorProps {
  content: string;
  setContent: (value: string) => void;
  maxCharacters: number;
}

export default function TextEditor({
  content,
  setContent,
  maxCharacters,
}: TextEditorProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Underline,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[250px] p-4",
      },
    },
  });

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        editor.chain().focus().setImage({ src: imageUrl }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  // Add link
  const addLink = () => {
    const url = window.prompt("Masukkan URL:");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  // Remove link
  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
  };

  // Hitung karakter tanpa HTML tags
  const getTextLength = (html: string) => {
    const text = html.replace(/<[^>]*>/g, "").trim();
    return text.length;
  };

  if (!editor) {
    return (
      <div className="w-full border border-gray-300 rounded-xl p-4">
        <div className="animate-pulse">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hidden input untuk upload gambar */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />

      {/* Toolbar */}
      <div className="border border-gray-300 border-b-0 rounded-t-xl p-3 bg-gray-50 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("bold") ? "bg-primary text-white" : ""
            }`}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("italic") ? "bg-primary text-white" : ""
            }`}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("underline") ? "bg-primary text-white" : ""
            }`}
            title="Underline"
          >
            <UnderlineIcon size={16} />
          </button>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("heading", { level: 1 }) ? "bg-primary text-white" : ""
            }`}
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("heading", { level: 2 }) ? "bg-primary text-white" : ""
            }`}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("paragraph") ? "bg-primary text-white" : ""
            }`}
            title="Paragraph"
          >
            <Type size={16} />
          </button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("bulletList") ? "bg-primary text-white" : ""
            }`}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("orderedList") ? "bg-primary text-white" : ""
            }`}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("blockquote") ? "bg-primary text-white" : ""
            }`}
            title="Quote"
          >
            <Quote size={16} />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: "left" }) ? "bg-primary text-white" : ""
            }`}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: "center" }) ? "bg-primary text-white" : ""
            }`}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: "right" }) ? "bg-primary text-white" : ""
            }`}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>
        </div>

        {/* Media & Links */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={editor.isActive("link") ? removeLink : addLink}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("link") ? "bg-primary text-white" : ""
            }`}
            title={editor.isActive("link") ? "Remove Link" : "Add Link"}
          >
            <LinkIcon size={16} />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="border border-gray-300 rounded-b-xl overflow-hidden">
        <EditorContent
          editor={editor}
          className="min-h-[300px] focus:outline-none"
        />
      </div>

      {/* Character Count */}
      <div className="text-sm text-gray-500 mt-2 flex justify-between">
        <span>{getTextLength(content)}/{maxCharacters} karakter</span>
        <span className="text-xs">
          {getTextLength(content) > maxCharacters && (
            <span className="text-red-500">Melebihi batas karakter!</span>
          )}
        </span>
      </div>
    </div>
  );
}