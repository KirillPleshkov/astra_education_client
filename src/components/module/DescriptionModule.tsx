import * as React from "react";
import "./styles.css";

interface IDescriptionModuleProps {
  short_description: string;
  skills: {
    id: number;
    name: string;
  }[];
  products: {
    id: number;
    name: string;
  }[];
}

const DescriptionModule: React.FunctionComponent<IDescriptionModuleProps> = ({
  short_description,
  skills,
  products,
}) => {
  return (
    <div className="module">
      <div className="block">
        <div className="blockTitle">Описание</div>
        <div className="blockMainText">{short_description}</div>
      </div>

      <div className="block">
        <div className="blockTitle">Преподаватели</div>
        <div className="blockMainText"></div>
      </div>

      <div className="block">
        <div className="blockTitle">Компетенци</div>
        <div className="blockMainText">
          {skills.map((elem) => (
            <div className="textBlock" key={elem.id}>
              {elem.name}
            </div>
          ))}
        </div>
      </div>

      <div className="block">
        <div className="blockTitle">Продукты ПАО Группы Астра</div>
        <div className="blockMainText">
          {products.map((elem) => (
            <div className="textBlock" key={elem.id}>
              {elem.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DescriptionModule;
