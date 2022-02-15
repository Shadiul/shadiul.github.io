import React from "react";
import WorkCard from "./WorkCard";

const works = [
  {
    id: "01",
    title: "Designing Dashboards",
    year: "2020",
    topic: "Dashboard",
    body: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
  },
  {
    id: "02",
    title: "Vibrant Portraits of 2020",
    year: "2018",
    topic: "Illustration",
    body: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
  },
  {
    id: "03",
    title: "36 Days of Malayalam type",
    year: "2018",
    topic: "Typography",
    body: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
  },
];

type Props = {};

const FeaturedWorks = (props: Props) => {
  return (
    <div className="basic-margin">
      <h6 className="text-xl">FeaturedWorks</h6>

      <div className="h-6" />

      <div className="flex flex-col gap-8 sm:gap-4">
        {works.map((item) => {
          return (
            <WorkCard
              key={item.id}
              title={item.title}
              year={item.year}
              topic={item.topic}
              body={item.body}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedWorks;
