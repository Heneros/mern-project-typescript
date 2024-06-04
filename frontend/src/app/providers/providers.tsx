
import store from 'app/store'
import { FC} from 'react'
import {Provider} from 'react-redux'

interface IProviders {
    readonly children: JSX.Element
}

export const Providers: FC<IProviders> = ({children}) => {
    return (
    <Provider store={store}>

    </Provider>
    )
}