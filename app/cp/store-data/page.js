"use client"

import React, { useEffect, useRef, useState } from "react";
import Service from "@/app/components/Service/Service";
import LastofOffersProducts from "@/app/components/lastProduct/LastofOffersProducts";
import FooterBar from "@/app/components/FooterBar/FooterBar";
import { AiFillCamera } from "react-icons/ai";
// import { BsFillPersonFill, BsTelephone } from "react-icons/bs";
// import { Col, Row } from "react-bootstrap";
import { Toast } from "primereact/toast";
// import { InputText } from "primereact/inputtext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Form, Col, Row, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { MultiSelect } from "primereact/multiselect";
import styles from "@/app/page.module.css";
import {
  getjsonStrings,
  getLogo,
  getUserImages,
  getUserInfo,
  saveImages,
  saveLogo,
  saveMatgarType,
} from "@/store/ControlPanalSlice";
import { baseUrl } from "../../baseUrl";

const SotreData = () => {
  const dispatch = useDispatch();
  // const { Categories } = useSelector((state) => state.CategoriesSlice);
  const { userInfo, UserImagesArr, MatgerLogoArr } = useSelector(
    (state) => state.ControlPanalSlice
  );

  const [Categories, setCategories ] = useState(null);

  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [selectType, setSelectType] = useState(null);
  const [selectTypeID, setSelectTypeID] = useState(null);
  const [images, setimages] = useState([]);

  const [loadngImage, setLoadingImage] = useState("");
  const [Logo, setUploadLogo] = useState("");

  const toast = useRef(null);

useEffect(()=>{
  fetch(`${baseUrl}/rest/rest.matgar/searchProduct`,{
    method : 'post',
    headers : {
      "Content-Type" : "application/json"
    },
    body : JSON.stringify({
      "catId": 0,
      "userId": parseFloat(window.localStorage.getItem("ClientId")),
      "page": 0,
      "query": "",
    })
  }).then((res)=> res.json()).then((data)=>setCategories(data))
},[])


  useEffect(() => {
    const UserId = window.localStorage.getItem("ClientId");
    if (!UserImagesArr) {
      dispatch(getUserImages(UserId));
    }
    if (!MatgerLogoArr) {
      dispatch(getLogo(UserId))
        .unwrap()
        .then((res) => {
          window.localStorage.setItem("souqUserLogo", res.id);
          setLoadingImage(res.id);
        });
    }
  }, [dispatch, UserImagesArr, MatgerLogoArr]);

  const UploadLogo = (file) => {
    const UserId = window.localStorage.getItem("ClientId");

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      const baseURL = reader.result;
      const position = baseURL.search("base64,");
      const res = baseURL.slice(position + 7);
      const data = {
        id: UserId,
        image: res,
      };
      dispatch(saveLogo(data))
        .unwrap()
        .then(() => {
          dispatch(getjsonStrings(UserId));
          dispatch(getUserInfo(UserId))
            .unwrap()
            .then((res) => {
              window.localStorage.setItem("souqUserLogo", res.logo);
              setLoadingImage(res.logo);
            });
        });
      setUploadLogo(res);
      setLoadingImage("");
    };
  };

  const UploadImge = (file) => {
    const UserId = window.localStorage.getItem("ClientId");
    // console.log(file[0]);
    const test = [...file];
    // console.log(test);
    test.map((ele) => {
      const reader = new FileReader();
      reader.readAsDataURL(ele);

      return (reader.onload = () => {
        // Make a fileInfo Object
        const baseURL = reader.result;
        const position = baseURL.search("base64,");
        const res = baseURL.slice(position + 7);
        setimages((current) => [...current, res]);
        const data = {
          uid: UserId,
          images: [res],
        };
        dispatch(saveImages(data));
      });
    });
  };

  const Selectcats = Categories && Categories.cats;

  const SendTypeAndCat = (e) => {
    const UserId = window.localStorage.getItem("ClientId");
    e.preventDefault();
    if (!selectType || description.length === 0 || name.length === 0) {
      showError();
    } else {
      const data = {
        uid: UserId,
        description,
        ints: selectTypeID,
        name,
      };
      dispatch(saveMatgarType(data))
        .unwrap()
        .then(() => {
          dispatch(getjsonStrings(UserId));
          dispatch(getUserInfo(UserId))
            .unwrap()
            .then((res) => {
              window.localStorage.setItem("souqUserLogo", res.logo);
              setLoadingImage(res.logo);
            });
        });
      showSuccess();
    }
  };
  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "برجاء اختيار تصنيف المتجر ووصفه",
      life: 3000,
    });
  };

  const showSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "تم تحديث البيانات بنجاح",
      life: 3000,
    });
  };

  const onTypeChange = (e) => {
    setSelectType(e);
    const Id = e.map((ele) => ele.id);
    setSelectTypeID(Id);
    // console.log(selectTypeID);
  };

  const MatgerImages = images.map((ele, idx) => {
    return (
      <div className={styles.Card_image} key={idx}>
        <LazyLoadImage
          src={`data:image/jpeg;base64,${ele}`}
          // src={`data:image/jpeg;base64,${Logo}`}
          // src={img}
          alt="matgerLogo"
          effect="blur"
          width={70}
          height={70}
        />
      </div>
    );
  });

  const GetMatgerImageApi =
    UserImagesArr &&
    UserImagesArr.map((ele, idx) => {
      return (
        <div className={styles.Card_image} key={idx}>
          <LazyLoadImage
            src={`https://souq.deltawy.com/imag?id=${ele.id}`}
            // src={`data:image/jpeg;base64,${Logo}`}
            // src={img}
            alt="matgerLogo"
            effect="blur"
            width={70}
            height={70}
          />
        </div>
      );
    });

  return (
    <> 
    <div  className={styles.SotreData}>
      {" "}
      <Toast ref={toast} />
      <div  className={styles.main_div}>
        <h2  className={styles.heading_h2}>تغير لوجو المتجر</h2>
        <div   className={styles.image_select_container}>
          {userInfo && (
            <div className={styles.Card_image}>
              {loadngImage || window.localStorage.getItem("souqUserLogo") ? (
                <LazyLoadImage
                  src={`https://souq.deltawy.com/imag?id=${
                    loadngImage || window.localStorage.getItem("souqUserLogo")
                  }`}
                  alt={userInfo.name}
                  effect="blur"
                  width={100}
                  height={100}
                />
              ) : (
                <LazyLoadImage
                  // src={`https://souq.deltawy.com/imag?id=${userInfo.logo}`}
                  src={`data:image/jpeg;base64,${Logo}`}
                  // src={img}
                  alt={userInfo.name}
                  effect="blur"
                  width={100}
                  height={100}
                />
              )}
            </div>
          )}
          <div  className={styles.Cardselect_div_image}>
            <label htmlFor="img">
              {" "}
              <AiFillCamera />
            </label>
            <input
              type="file"
              style={{ visibility: "hidden" }}
              id="img"
              name="img"
              accept="image/*"
              onChange={(e) => {
                // getBase64(e.target.files[0]);
                UploadLogo(e.target.files[0]);
              }}
            />
          </div>
        </div>
        <h1 className={styles.heading_h} >
          <label htmlFor="img"> تغير لوجو المتجر</label>
        </h1>
      </div>
      <div className={styles.main_div}>
        <h2 className={styles.heading_h2}>تغير صورة المتجر </h2>

        <div className={styles.change_store_image}>
          <input
            type="file"
            style={{ display: "none" }}
            id="storeImage"
            name="storeImage"
            accept="image/*"
            multiple={true}
            onChange={(e) => {
              // getBase64(e.target.files[0]);
              UploadImge(e.target.files);
            }}
          />

          <label htmlFor="storeImage">
            {" "}
            <AiFillCamera />
          </label>
          <label htmlFor="storeImage"> اضغط لرفع الصورة </label>
          <label htmlFor="storeImage">Browse files</label>
        </div>
      </div>
      <div className={styles.MatgerImage}>
        {MatgerImages} {GetMatgerImageApi}
      </div>
      <div className={styles.matger_type_container}>
        <h2 className={styles.heading_h2}>نوع المتجر ووصفه</h2>
        <form>
          <Container>
            <Row>
              <Col className="cloumn" xs={12} md={12}>
                <div  className={`${styles.pro_input_div} ${styles.matgerName}`}>
                  <label htmlFor="name">اسم المتجر</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </Col>
              <Col className="cloumn" xs={12} md={12}>
                <div className={styles.select_type_container}>
                  <MultiSelect
                    value={selectType}
                    options={Selectcats}
                    onChange={(e) => onTypeChange(e.value)}
                    optionLabel="name"
                    placeholder="التصنيف"
                    maxSelectedLabels={3}
                  />
                </div>
                <Form.Control
                  as="textarea"
                  placeholder="وصف المتجر"
                  style={{ maxHeight: "250px", minHeight: "150px" }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Col>
              {/* <Col className={styles.cloumn} xs={12} md={6}>
              
              </Col> */}
            </Row>
          </Container>
          <button
            name="حفظ"
            type="submit"
            className={styles.submit_button}
            onClick={(e) => {
              SendTypeAndCat(e);
            }}
          >
            تحديث البيانات
          </button>
        </form>
      </div>
    </div>
    <Service />
   <LastofOffersProducts />
    <FooterBar />
    </>

  );
};

export default SotreData;
