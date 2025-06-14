import { theme, Typography, Button, Card, Row, Col, Space, Divider } from "antd";
import { useTranslation } from "react-i18next";
import {
  ApiOutlined,
  RocketOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  CodeOutlined,
  CloudServerOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

import style from "./MainView.module.css";
import { useNavigate } from "react-router";

const { Title, Paragraph, Text } = Typography;

export const MainView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    token: { colorPrimary, colorBgContainer },
  } = theme.useToken();

  const features = [
    {
      icon: <ApiOutlined className={style.featureIcon} />,
      title: t("mainView.features.api.title"),
      description: t("mainView.features.api.description"),
    },
    {
      icon: <DatabaseOutlined className={style.featureIcon} />,
      title: t("mainView.features.database.title"),
      description: t("mainView.features.database.description"),
    },
    {
      icon: <ThunderboltOutlined className={style.featureIcon} />,
      title: t("mainView.features.instant.title"),
      description: t("mainView.features.instant.description"),
    },
    {
      icon: <CodeOutlined className={style.featureIcon} />,
      title: t("mainView.features.noCode.title"),
      description: t("mainView.features.noCode.description"),
    },
    {
      icon: <CloudServerOutlined className={style.featureIcon} />,
      title: t("mainView.features.cloud.title"),
      description: t("mainView.features.cloud.description"),
    },
    {
      icon: <RocketOutlined className={style.featureIcon} />,
      title: t("mainView.features.scalable.title"),
      description: t("mainView.features.scalable.description"),
    },
  ];

  const steps = [
    {
      number: "01",
      title: t("mainView.steps.create.title"),
      description: t("mainView.steps.create.description"),
    },
    {
      number: "02",
      title: t("mainView.steps.design.title"),
      description: t("mainView.steps.design.description"),
    },
    {
      number: "03",
      title: t("mainView.steps.deploy.title"),
      description: t("mainView.steps.deploy.description"),
    },
  ];

  return (
    <div className={style.container}>
      <div className={style.heroSection}>
        <div className={style.heroContent}>
          <Title className={style.mainTitle}>
            {t("mainView.mainText.0")}
            <br />
            <span style={{ color: colorPrimary }}>{t("mainView.mainText.1")}</span>
          </Title>
          <Paragraph className={style.subText}>{t("mainView.subText")}</Paragraph>
          <Space size="middle" className={style.heroButtons}>
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              onClick={() => navigate("/table/")}
            >
              {t("mainView.getStarted")}
            </Button>
          </Space>
        </div>
        <div className={style.heroVisual}>
          <div className={style.codeBlock}>
            <div className={style.codeHeader}>
              <div className={style.codeDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <Text style={{ color: "white" }} type="secondary">
                REST API
              </Text>
            </div>
            <div className={style.codeContent}>
              <div className={style.codeLine}>
                <Text style={{ color: "white" }} code>
                  GET /api/users
                </Text>
              </div>
              <div className={style.codeLine}>
                <Text style={{ color: "white" }} code>
                  POST /api/users
                </Text>
              </div>
              <div className={style.codeLine}>
                <Text style={{ color: "white" }} code>
                  DELETE /api/users/:id
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <div className={style.featuresSection}>
        <Title level={2} className={style.sectionTitle}>
          {t("mainView.features.title")}
        </Title>
        <Paragraph className={style.sectionSubtitle}>
          {t("mainView.features.subtitle")}
        </Paragraph>

        <Row gutter={[24, 24]} className={style.featuresGrid}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card
                className={style.featureCard}
                hoverable
                style={{ background: colorBgContainer }}
              >
                <div className={style.featureContent}>
                  {feature.icon}
                  <Title level={4}>{feature.title}</Title>
                  <Paragraph type="secondary">{feature.description}</Paragraph>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Divider />

      <div className={style.stepsSection}>
        <Title level={2} className={style.sectionTitle}>
          {t("mainView.howItWorks.title")}
        </Title>
        <Paragraph className={style.sectionSubtitle}>
          {t("mainView.howItWorks.subtitle")}
        </Paragraph>

        <div className={style.stepsContainer}>
          {steps.map((step, index) => (
            <div key={index} className={style.stepCard}>
              <div className={style.stepNumber} style={{ color: colorPrimary }}>
                {step.number}
              </div>
              <div className={style.stepContent}>
                <Title level={4}>{step.title}</Title>
                <Paragraph type="secondary">{step.description}</Paragraph>
              </div>
              {index < steps.length - 1 && (
                <ArrowRightOutlined className={style.stepArrow} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={style.ctaSection}>
        <Title level={2} className={style.ctaTitle}>
          {t("mainView.cta.title")}
        </Title>
        <Paragraph className={style.ctaSubtitle}>
          {t("mainView.cta.subtitle")}
        </Paragraph>
        <Button
          type="default"
          size="large"
          onClick={() => navigate("/table/")}
          className={style.ctaButton}
        >
          {t("mainView.cta.button")}
        </Button>
      </div>
    </div>
  );
};
