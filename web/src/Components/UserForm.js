import React, {useState} from 'react';
import styled from 'styled-components';

import Button from "./Button";

const Wrapper = styled.div`
  border: 2px solid #e2e5f5;
  border-radius: 5px;
  max-width: 500px;
  padding: 1em;
  margin: 0 auto;
`;

const Form = styled.form`
  label {
    width: 100%;
    display: block;
    line-height: 1em;
    margin-bottom: 0.5em;
  }

  input {
    width: 100%;
    line-height: 2em;
    margin-bottom: 1em;
    border-radius: 5px;
    border: 1px solid #e2e5f5;
  }
`;

const UserForm = props => {
    //Устанавливаем состояние формы по умолчанию
    const [values, setValues] = useState();

    //Обновляем состояние, когда пользователь вводит данные в форму
    const onChange = event => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
    };

    return (
        <Wrapper>
            {/*Отображаем соответсвующий заголовок формы*/}
            {props.formType === 'signUp' ? <h2>Sign Up</h2> : <h2>Sign In</h2>}
            {/*Выполняем мутацию, когда пользователь отправляет форму*/}
            <Form
                onSubmit={e => {
                    e.preventDefault();
                    props.action({
                        variables: {
                            ...values
                        }
                    });
                }}>
                {props.formType === 'signUp' && (
                    <React.Fragment>
                        <label htmlFor="username">Username:</label>
                        <input
                            required
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username"
                            onChange={onChange}
                        />
                    </React.Fragment>
                )}
                <label htmlFor="email">Email:</label>
                <input
                    required
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    onChange={onChange}
                />
                <label htmlFor="password">Password:</label>
                <input
                    required
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    onChange={onChange}
                />
                <Button type="submit">Submit</Button>
            </Form>
        </Wrapper>
    );
};

export default UserForm;