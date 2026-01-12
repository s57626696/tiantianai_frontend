import React, { useEffect, useState } from "react";
import { Spin } from "antd";

interface LogoData {
  id: number;
  name: string;
  url: string;
}

const Logo: React.FC = () => {
  const [logo, setLogo] = useState<LogoData | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/logo/")
      .then(res => res.json())
      .then(data => {
        // 拼接完整图片路径
        setLogo({
          ...data,
          url: "http://127.0.0.1:8000" + data.url
        });
      })
      .catch(err => {
        console.error("获取 Logo 失败", err);
      });
  }, []);

  if (!logo) {
    return <Spin />;
  }

  return (
    <img
      src={logo.url}
      alt={logo.name}
      style={{ height: 32 }}
    />
  );
};

export default Logo;
