import { Alert, Button, Card, Flex, Form, Input, Spin, Typography } from "antd";

import signin from "../assets/signin.png";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";

const Login = () => {
  const { loading, error, loginUser } = useLogin();
  const handleLogin = async (values) => {
    await loginUser(values);
  };
  return (
    <Card className="m-8">
      <div className="md:flex md:flex-row md:justify-around flex flex-col items-center justify-center">
        {/*Image*/}
        <div className="flex justify-center items-center">
          <img src={signin} alt="" className=" rounded-md" />
        </div>

        <div>
          <Flex gap="" align="center">
            <div className="flex justify-center items-center flex-col ">
              {/*form*/}
              <Flex vertical flex={1}>
                <Typography.Title level={3} strong className="title">
                  Sign In
                </Typography.Title>

                <Typography.Text type="secondary" strong className="slogan">
                  Unlock your world!
                </Typography.Text>
                <Form
                  layout="vertical"
                  onFinish={handleLogin}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Email!",
                      },
                      {
                        type: "email",
                        message: "The input is not vaild Email!",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Enter you email" />
                  </Form.Item>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Password!",
                      },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      placeholder="Enter you password"
                    />
                  </Form.Item>

                  {error && (
                    <Alert
                      description={error}
                      type="error"
                      showIcon
                      closable
                      className="alert"
                    />
                  )}

                  <Form.Item>
                    <Button
                      type={`${loading ? "" : "primary"}`}
                      htmlType="submit"
                      size="large"
                      className="btn"
                    >
                      {loading ? <Spin /> : "Sign In"}
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Link to="/register">
                      <Button size="large" className="btn">
                        Create an account
                      </Button>
                    </Link>
                  </Form.Item>
                </Form>
              </Flex>
            </div>
          </Flex>
        </div>
      </div>
    </Card>
  );
};

export default Login;
