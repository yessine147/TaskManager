import { Link } from 'react-router-dom';

export const Navbar = () => {
    return (
        <nav className='navbar navbar-expand navbar-dark bg-dark'>
            <div className='container-fluid'>
                <Link to={'/tasks'} className='navbar-brand'>
                    Home Page
                </Link>
                <div className='navbar-nav ml-auto'>
                    <li className='nav-item'>
                        <Link to={'/tasks'} className='nav-link'>
                            Tasks
                        </Link>
                    </li>
                </div>
                <div className='navbar-nav'>
                    <li className='nav-item'>
                        <Link to={'/add'} className='nav-link'>
                            Add task
                        </Link>
                    </li>
                </div>
            </div>
        </nav>
    )
}
