import React, {useState} from "react";
import styled from "styled-components";

import Button from "./Button";

const Wrapper = styled.div`
  height: 100%;
  margin-bottom: 10px;
`;

const Form = styled.form`
  height: 100%;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 50%;
`;

const NoteForm = props => {
    //Устанавливаем состояния формы по-умолчанию
    const [value, setValue] = useState({content: props.content || ''});

    //Обновляем это состояние при вводе пользователем данных
    const onChange = event => {
        setValue({
            ...value,
            [event.target.name]: event.target.value
        });
    };

    const noteSubmit = e => {
        e.preventDefault();
        props.action({
            variables: {
                ...value
            }
        })
    }

    return (
        <Wrapper>
            <Form onSubmit={noteSubmit}>
                <TextArea
                    required
                    type="text"
                    name="content"
                    placeholder="Note content"
                    value={value.content}
                    onChange={onChange}
                />
                <Button type="submit">Save</Button>
            </Form>
        </Wrapper>
    );
};

export default NoteForm;