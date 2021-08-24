import React, { useState } from "react";
import cn from "classnames";
import styles from "./UploadDetails.module.sass";
import Icon from "../../components/Icon";
import TextInput from "../../components/TextInput";
import Switch from "../../components/Switch";
import Modal from "../../components/Modal";
import Preview from "./Preview";
import FolowSteps from "./FolowSteps";
import { NFTStorage } from "nft.storage"
import CryptoJs from 'crypto-js'
import { useUser } from "../../providers/UserProvider";

const royaltiesOptions = ["10%", "20%", "30%"];

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

const apikey = process.env.REACT_APP_NFT_STORAGE_KEY

const encrypt = (text) => {
  return CryptoJs.enc.Base64.stringify(CryptoJs.enc.Utf8.parse(text))
}

const Upload = () => {
  //const [royalties, setRoyalties] = useState(royaltiesOptions[0]);
  const [sale, setSale] = useState(true);
  //const [price, setPrice] = useState(false);
  const [locking, setLocking] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visiblePreview, setVisiblePreview] = useState(false);
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [preview, setPreview] = useState()
  const [file, setFile] = useState()
  const [success, setSuccess] = useState(false)

  const { mintNsft, collection, createCollection, loading, error } = useUser()
  console.log(error)

  const client = new NFTStorage({ token: apikey })

  const handleNameChange = async (e) => {
    setName(e)
  }

  const handleDescriptionChange = async (e) => {
    setDesc(e)
  }

  const handleFileInput = async (e) => {
    setPreview(URL.createObjectURL(e.target.files[0]))
    setFile(e.target.files[0])
  }

  // Test videos

  const handleSubmit = async (e) => {
    if (!collection) {
      await createCollection()
    }

    //const files = e.nativeEvent["target"]["form"][0].files[0]
    const filetype = file["type"].split("/")[0]
    let type;
    if (filetype === 'image') {
      type = 0
    } else if (filetype === 'video') {
      type = 1
    } else {
      type = 2
    }

    const metadata = await client.store({
      name: name,
      description: desc,
      image: file
    })

    let hash = metadata.url

    if (locking) {
      hash = encrypt(metadata.url)
    }

    const tx = await mintNsft(hash, type, name, desc, 1)
    .then((response) => {
      setSuccess(true)
      console.log(response)
    })
    .catch((err) => {
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
                Create single collectible
              </div>
              <button
                className={cn("button-stroke button-small", styles.button)}
              >
                Switch to Multiple
              </button>
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
                  <div className={styles.category}>NSFT Details</div>
                  <div className={styles.fieldset}>
                    <TextInput
                      className={styles.field}
                      label="NSFT name"
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
                  </div>
                </div>
              </div>
              <div className={styles.options}>
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
              </div>
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
                    setVisibleModal(true)
                    handleSubmit(e)
                  }}
                  // type="button" hide after form customization
                  type="button"
                >
                  <span>Create item</span>
                  <Icon name="arrow-next" size="10" />
                </button>
              </div>
            </form>
          </div>
          <Preview
            className={cn(styles.preview, { [styles.active]: visiblePreview })}
            onClose={() => setVisiblePreview(false)}
            obj={{
              file: preview,
              name: name,
              desc: desc
            }}
          />
        </div>
      </div>
      <Modal visible={visibleModal} onClose={() => setVisibleModal(false)}>
        <FolowSteps className={styles.steps} obj={{ loading: loading, error: error, success: success }} onClose={() => setVisibleModal(false)} />
      </Modal>
    </>
  );
};

export default Upload;
