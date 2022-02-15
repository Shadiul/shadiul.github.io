import React from "react";

type Props = {
  title: string;
  body: string;
  time: string;
  category: string;
};

const BlogCard = (props: Props) => {
  return (
    <div className="bg-bg p-6 w-full rounded">
      <h3 className="text-2xl leading-9 font-bold">{props.title}</h3>

      <div className="h-4" />

      <div className="flex gap-4">
        <p>12 Feb 2020</p>
        <div className="h-5 w-px bg-black rounded-sm" />
        <p>Design, Pattern</p>
      </div>

      <div className="h-4" />

      <p>
        Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
        sint. Velit officia consequat duis enim velit mollit. Exercitation
        veniam consequat sunt nostrud amet.
      </p>
    </div>
  );
};

export default BlogCard;
