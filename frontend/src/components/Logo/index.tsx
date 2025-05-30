import { Typography } from "antd";
import { Link } from "react-router";

import style from "./Logo.module.css";

const { Title } = Typography;

export const Logo = () => {
  return (
    <>
      <Title>
        <Link to="/" className={style.link}>
          <span className={style.changeableText}>R</span>A
        </Link>
      </Title>
    </>
  );
};
