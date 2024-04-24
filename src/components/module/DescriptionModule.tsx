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
      <div className="moduleBlock">
        <div className="moduleBlockTitle">Описание</div>
        <div className="moduleBlockMainText">{short_description}</div>
      </div>

      <div className="moduleBlock">
        <div className="moduleBlockTitle">Преподаватели</div>
        <div className="moduleBlockMainText"></div>
      </div>

      <div className="moduleBlock">
        <div className="moduleBlockTitle">Компетенци</div>
        <div className="moduleBlockMainText">
          {skills.map((elem) => (
            <div className="textBlock" key={elem.id}>
              {elem.name}
            </div>
          ))}
        </div>
      </div>

      <div className="moduleBlock">
        <div className="moduleBlockTitle">Продукты ПАО Группы Астра</div>
        <div className="moduleBlockMainText">
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
