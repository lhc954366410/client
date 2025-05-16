import { Modal } from "antd"

const showError = (err: any) => {
    Modal.error({
        title: '错误',
        content: <div dangerouslySetInnerHTML={{ __html: err.message }}>


        </div>,
    })
    
}
export default showError