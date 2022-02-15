import { Icon } from "@mui/material";
import React from "react";

type Props = {
  title: string;
  year: string;
  topic: string;
  body: string;
};

const WorkCard = (props: Props) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div>
        <div className="bg-gray-400 w-full h-48 rounded-md sm:w-64 text-center">
          <Icon
            className="text-white"
            sx={{
              fontSize: "192px",
            }}
          >
            photo
          </Icon>
        </div>
      </div>

      <div>
        <h3 className="text-2xl leading-9 font-bold">{props.title}</h3>

        <div className="h-2 sm:h-4" />

        <div className="flex gap-6 items-baseline">
          <p className="bg-gray-900 rounded-2xl text-white font-bold px-3">
            {props.year}
          </p>

          <p className="text-gray-500 text-xl">{props.topic}</p>
        </div>

        <div className="h-4" />

        <p>{props.body}</p>
      </div>
    </div>
  );
};

export default WorkCard;
