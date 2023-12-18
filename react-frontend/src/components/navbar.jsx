import React from 'react'
import { Link } from "react-router-dom";
import './nonSpecific.css';


function NaviBar() {
    return (
        <div className='navi-bar'>
            <div className='navLogo'>

            </div>
            <div className="nav-linker">
                <ul>
                    <li>
                        <Link to="/">
                            Home
                        </Link>
                    </li>
                    <li>

                        <Link to="/">
                            Editor
                        </Link>
                    </li>
                    <li>

                        <Link to="/">
                            Temp
                        </Link>
                    </li>
                    <li>

                    <Link to="/account">
                            Profil
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default NaviBar