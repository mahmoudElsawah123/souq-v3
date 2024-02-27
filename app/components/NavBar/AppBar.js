"use client"
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "@/app/page.module.css";
import Link from "next/link";

const AppBar = () => {
  const dispatch = useDispatch();
  const { searchCharInput } = useSelector(
    (state) => state.ShopSlice
  );
  const [visibleTop, setVisibleTop] = useState(false);
  const [search, setSearch] = useState(searchCharInput);
  const [showNav2, setShowNav2] = useState(false);
  const [isNavBarCompTowVisible, setNavBarCompTowVisible] = useState(false);

  const { Categories } = useSelector((state) => state.CategoriesSlice);

  const [getSouqLogin , setGetSouqLogin] = useState(false)
  useEffect(() => {
    setGetSouqLogin(window.localStorage.getItem('souqLogin'))
  }, []);


    const navLinkStyles = ({ isActive }) => ({
      fontWeight: isActive ? "bold" : "500",
      color: isActive ? "#274160" : "#000",
      fontSize: isActive ? "22px" : "21px",
    });


  return (
    <>
      <div className={styles.NavBar} onClick={() => setShowNav2(true)}>
   
      <div  className={`${styles.NavList} ${styles.disFlex}`}>
            <nav className="navbar navbar-expand-md navbar-light " >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                
                    <li className="nav-item" >
                      <Link
                        className="nav-link Navitem "
                        href="/"
                        onClick={() => {
                          window.scrollTo({
                            top: 0,
                            left: 100,
                            behavior: "instant",
                          });
                        }}
                        style={navLinkStyles({ isActive: true })}
                      >
                        الرئيسية
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link Navitem "
                        href="/shop"
                        onClick={() => {
                          window.scrollTo({
                            top: 0,
                            left: 100,
                            behavior: "instant",
                          });
                        }}
                        style={navLinkStyles({ isActive: true })}
                      >
                        المتجر
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link Navitem"
                        href="/offers"
                        style={navLinkStyles({ isActive: true })}
                        onClick={() => {
                          window.scrollTo({
                            top: 0,
                            left: 100,
                            behavior: "instant",
                          });
                        }}
                      >
                        العروض
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link Navitem"
                        href="/matgars"
                        style={navLinkStyles({ isActive: true })}
                        onClick={() => {
                          window.scrollTo({
                            top: 0,
                            left: 100,
                            behavior: "instant",
                          });
                        }}
                      >
                        المتاجر
                      </Link>
                    </li>
                    {getSouqLogin ? 
                      <li className="nav-item">
                        <Link
                          className="nav-link Navitem"
                          href="/cp"
                          style={navLinkStyles({ isActive: true })}
                          onClick={() => {
                            window.scrollTo({
                              top: 0,
                              left: 100,
                              behavior: "instant",
                            });
                          }}
                        >
                          لوحة التحكم
                        </Link>
                      </li>
                    : null}
              </ul>
            </nav>
          </div>
      </div>
    </>
  );
};

export default AppBar;
