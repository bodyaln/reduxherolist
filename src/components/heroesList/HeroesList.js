import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

// import { fetchHeroes } from '../../actions';
import {heroDeleted, fetchHeroes, selectAll} from './heroesSlice';

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE


// deleteItem = (id) => {
//     this.setState(({data}) => {
//         return {
//             data: data.filter(item => item.id !== id)
//         }
//     })
// }
// const removeTodo = id => {
//     const removeArr = [...todos].filter(todo => todo.id !== id)

//     setTodos(removeArr)
//   }

const HeroesList = () => {

    const filterHeroesSelector = createSelector(
        (state) => state.filters.activeFilter,
        selectAll,
        (filter, heroes) =>{
            if (filter === 'all'){
                return heroes
            }
            else{
                return heroes.filter(item => item.element === filter);
            }
        }
    );

    // const filteredHeroes =useSelector(state => {
    //     if (state.filters.activeFilter === 'all'){
    //         return state.heroes.heroes
    //     }
    //     else{
    //         return state.heroes.heroes.filter(item => item.element === state.filters.activeFilter);
    //     }
    // })
    const filteredHeroes = useSelector(filterHeroesSelector);
    const heroesLoadingStatus = useSelector(state => state.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes())

        // eslint-disable-next-line
    }, []);

    // Функция берет id и по нему удаляет ненужного персонажа из store
    // ТОЛЬКО если запрос на удаление прошел успешно
    // Отслеживайте цепочку действий actions => reducers
    const onDelete = useCallback((id) => {
        // Удаление персонажа по его id
        request(`http://localhost:3001/heroes/${id}`, "DELETE")
            .then(data => console.log(data, 'Deleted'))
            .then(dispatch(heroDeleted(id)))
            .catch(err => console.log(err));
        // eslint-disable-next-line  
    }, [request]);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }
    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr.map(({id, ...props}) => {
            return <HeroesListItem {...props} key={id} onDelete={()=>onDelete(id)}/>
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;