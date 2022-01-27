import React, { useState } from "react";
import cn from "classnames";
import styles from "./UploadDetails.module.sass";
import Icon from "../../components/Icon";
import TextInput from "../../components/TextInput";
//import Switch from "../../components/Switch";
import Modal from "../../components/Modal";
import Preview from "./Preview";
import FolowSteps from "./FolowSteps";
import { NFTStorage } from "nft.storage/dist/bundle.esm.min.js"
import CryptoJs from 'crypto-js'
import { useUser } from "../../providers/UserProvider";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import image from './nsft-logo.jpeg';

//const royaltiesOptions = ["10%", "20%", "30%"];
/*
const items = [
  {
    title: "Create collection",
    color: "#4BC9F0",
  },
  {
    title: "Crypto Legend - Professor",
    color: "#45B26B",
  },
  {
    title: "Crypto Legend - Professor",
    color: "#EF466F",
  },
  {
    title: "Legend Photography",
    color: "#9757D7",
  },
];
*/

const apikey = process.env.REACT_APP_NFT_STORAGE_KEY

const encrypt = (text) => {
  return CryptoJs.enc.Base64.stringify(CryptoJs.enc.Utf8.parse(text))
}

const Upload = () => {
  //const [royalties, setRoyalties] = useState(royaltiesOptions[0]);
  //const [sale, setSale] = useState(true);
  //const [price, setPrice] = useState(false);
  //const [locking, setLocking] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visiblePreview, setVisiblePreview] = useState(false);
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [count, setCount] = useState(1)
  const [preview, setPreview] = useState()
  const [previewType, setPreviewType] = useState('')
  const [file, setFile] = useState()
  const [success, setSuccess] = useState(false)
  const [verified, setVerified] = useState(false)
  const [fileCheck, setFileCheck] = useState(false)
  const [load, setLoad] = useState(false)
  const [err, setErr] = useState(false)
  const [validate, setValidate] = useState(false)

  const { mintNsft, collection, fetchUserMintedNsfts, error, loading, errorText } = useUser()

  const location = useLocation()

  const client = new NFTStorage({ token: apikey })

  const handleNameChange = async (e) => {
    setName(e)
  }

  const handleDescriptionChange = async (e) => {
    setDesc(e)
  }

  const handleCountChange = async (e) => {
    setValidate(false)
    setCount(e)
  }

  const handleFileInput = async (e) => {
    setFileCheck(false)
    let file = e.target.files[0]
    /*
    let reader = new FileReader()
    reader.readAsArrayBuffer(file)
    let data;
    reader.onload = function() {
      console.log(reader)
      console.log(reader.result)
      let res = reader.result
      data = new File([res], "test.mp4", {
        type: "video/mp4"
      })
      console.log(data)
      setFile(data)
    }
    */
    setFile(file)
    setPreview(URL.createObjectURL(e.target.files[0]))
    setPreviewType(e.target.files[0].type.split('/')[0])
  }

  // Test videos


  const handleSubmit = async (e) => {
    
    if (!collection) {
      setVerified(true)
      return
    }

    if (!file) {
      setFileCheck(true)
      return
    }

    if (count < 1) {
      setValidate(true)
      return
    }

    setLoad(true)

    setVisibleModal(true)

    const filetype = file["type"].split("/")[0]
    let type;
    if (filetype === 'image') {
      type = 0
    } else if (filetype === 'video') {
      type = 1
    } else {
      type = 2
    }


    const stockImage = new File([image], "image.jpeg", {
      type: "image/jpeg"
    })

    let metadata;

    try {
      metadata = await client.store({
        name: name,
        description: desc,
        image: stockImage,
        properties: {
          file: file
        }
      })
    } catch(err) {
      console.log(err)
      setLoad(false)
      setErr(true)
    }


    let hash = metadata.url
    hash = encrypt(metadata.url)

    //eslint-disable-next-line
    const tx = await mintNsft(hash, type, name, desc, parseInt(count))
    .then((response) => {
      if (response) {
        //setSuccess(true)
        setLoad(false)
        fetchUserMintedNsfts()
      } else {
        //setError(true)
        setLoad(false)
        setSuccess(false)
      }
    })
    .catch((err) => {
      //setError(true)
      setLoad(false)
      setSuccess(false)
      console.log(err)
    })
  }

  return (
    <>
      <div className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.wrapper}>
            <div className={styles.head}>
              <div className={cn("h2", styles.title)}>
                {location.pathname.split("/")[1] === 'upload-single' ? 'Create a collectible' : 'Create multiple collectibles'}
              </div>
              <Link
                className={styles.button}
                to={location.pathname.split("/")[1] === 'upload-single' ? '/upload-multiple' : '/upload-single'}
              >
              <button
                className={cn("button-stroke button-small", styles.button)}
              >
                {location.pathname.split("/")[1] === 'upload-single' ? 'Switch to Multiple' : 'Switch to Single'}
              </button>
              </Link>
            </div>
            <form className={styles.form} action="">
              <div className={styles.list}>
                <div className={styles.item}>
                  <div className={styles.category}>Upload file</div>
                  <div className={styles.note}>
                    Drag or choose your file to upload
                  </div>
                  <div className={styles.file}>
                    <input className={styles.load} type="file" accept="image/*,video/*" onChange={handleFileInput} />
                    <div className={styles.icon}>
                      <Icon name="upload-file" size="24" />
                    </div>
                    <div className={styles.format}>
                      Image and Video files accepted. Max 32Gb.
                    </div>
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.category}>NFT Details</div>
                  <div className={styles.fieldset}>
                    <TextInput
                      className={styles.field}
                      label="Title"
                      name="NSFT"
                      type="text"
                      required
                      onChange={(e) => handleNameChange(e.currentTarget.value)}
                    />
                    <TextInput
                      className={styles.field}
                      label="Description"
                      name="Description"
                      type="text"
                      placeholder=""
                      required
                      onChange={(e) => handleDescriptionChange(e.currentTarget.value)}
                    />
                    {location.pathname.split("/")[1] === 'upload-multiple' && (
                      <TextInput
                      className={styles.field}
                      label="Count (Max 10)"
                      name="Count"
                      type="number"
                      value={count}
                      placeholder=""
                      step={1}
                      min={1}
                      max={10}
                      required
                      onChange={(e) => handleCountChange(e.currentTarget.value)}
                    />
                    )}
                    
                  </div>
                </div>
              </div>
              {/*<div className={styles.options}>
                <div className={styles.option}>
                  <div className={styles.box}>
                    <div className={styles.category}>Put up for auction</div>
                    <div className={styles.text}>
                      This item will be up for auction and you'll be able to receive bids immediately.
                    </div>
                  </div>
                  <Switch value={sale} setValue={setSale} />
                </div>
                <div className={styles.option}>
                  <div className={styles.box}>
                    <div className={styles.category}>Unlock once purchased</div>
                    <div className={styles.text}>
                      If checked then the content of your item will only be viewable after a successful sale.
                    </div>
                  </div>
                  <Switch value={locking} setValue={setLocking} />
                </div>
                </div>*/}
              <div className={styles.foot}>
                <button
                  className={cn("button-stroke tablet-show", styles.button)}
                  onClick={() => setVisiblePreview(true)}
                  type="button"
                >
                  Preview
                </button>
                <button
                  className={cn("button", styles.button)}
                  onClick={(e) => {
                    handleSubmit(e)
                  }}
                  // type="button" hide after form customization
                  type="button"
                >
                  <span>Create item</span>
                  <Icon name="arrow-next" size="10" />
                </button>
                {verified && (<div>You must verify your account before you can mint</div>)}
                {fileCheck && (<div>Please upload content before continuing</div>)}
                {validate && (<div>Count must be a number greater than 1</div>)}
              </div>
            </form>
          </div>
          <Preview
            className={cn(styles.preview, { [styles.active]: visiblePreview })}
            onClose={() => setVisiblePreview(false)}
            obj={{
              file: preview,
              type: previewType,
              name: name,
              desc: desc,
              count: count
            }}
          />
        </div>
      </div>
      <Modal visible={visibleModal} onClose={() => setVisibleModal(false)}>
        <FolowSteps className={styles.steps} err={errorText} obj={{ loading: loading, error: error, success: success, load: load, err: err }} onClose={() => setVisibleModal(false)} />
      </Modal>
    </>
  );
};

export default Upload;
