import React from 'react';
import {useQuery, gql} from '@apollo/client';
import Loading from "../StyledComponents/Loading";
import NoteFeed from "../Components/NoteFeed";
import Button from "../Components/Button";

//Наш GraphQL-запрос, хранящийся в виде переменной
const GET_NOTES = gql`
    query noteFeed($cursor: String) {
        noteFeed(cursor: $cursor) {
            cursor
            hasNextPage
            notes {
                id
                createdAt
                content
                favoriteCount
                author {
                   username
                   id
                   avatar
                }
            }
        }
    }
    `;

const Home = () => {

    //Хук запроса
    const {data, loading, error, fetchMore} = useQuery(GET_NOTES);

    //Если данные не загружаются, отображаем сообщение о загрузке
    if (loading) return <div><Loading/></div>;
    //Если при получении данных произошел сбой, отображаем сообщение об ошибке
    if (error) return <div>Error!</div>

    //Если получение данных прошло успешно, отображаем их в UI
    return (
        <React.Fragment>
            <NoteFeed notes={data.noteFeed.notes}/>
            {/* Only display the Load More button if hasNextPage is true */}
            {data.noteFeed.hasNextPage && (
                //onClick выполняет запрос, передавая в качестве переменной текущий курсор
                <Button
                    onClick={() =>
                        fetchMore({
                            variables: {
                                cursor: data.noteFeed.cursor
                            },
                            updateQuery: (previousResult, {fetchMoreResult}) => {
                                return {
                                    noteFeed: {
                                        cursor: fetchMoreResult.noteFeed.cursor,
                                        hasNextPage:
                                        fetchMoreResult.noteFeed.hasNextPage,
                                        //Совмещаем новые результаты со старыми
                                        notes:
                                            [
                                                ...previousResult.noteFeed.notes,
                                                ...fetchMoreResult.noteFeed.notes
                                            ],
                                        __typename:
                                            'noteFeed'
                                    }
                                };
                            }
                        })
                    }
                >
                    Load more
                </Button>
            )}
        </React.Fragment>
    );
};

export default Home;

