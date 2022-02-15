import React from "react";
import BlogCard from "./BlogCard";

type Props = {};

const recentPosts = [
  {
    id: "01",
    title: "Making a design system from scratch",
    body: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
    time: "12 Feb 2020",
    category: "Design, Pattern",
  },
  {
    id: "02",
    title: "Creating pixel perfect icons in Figma",
    body: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
    time: "12 Feb 2020",
    category: "Figma, Icon Design",
  },
];

const RecentPosts = (props: Props) => {
  return (
    <div className="bg-bg-alt">
      <div className="basic-margin py-6">
        <div className="flex justify-between">
          <h6 className="text-xl">Recent posts</h6>
          <a href="#">View all</a>
        </div>

        <div className="h-6" />

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {recentPosts.map((item) => {
            return (
              <BlogCard
                key={item.id}
                title={item.title}
                body={item.body}
                category={item.category}
                time={item.time}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentPosts;
