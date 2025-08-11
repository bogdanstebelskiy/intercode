import LoginForm from "../components/LoginForm.jsx";
import {Flex} from "@mantine/core";

const LoginPage = () => {
    return (
        <Flex justify="center" align="center" mt="xl">
            <LoginForm />
        </Flex>
    );
};

export default LoginPage;