import React, {useState} from "react";
import {Card, Steps, Form, Input, Button, Space, message} from "antd";
import {useNavigate} from "react-router-dom";
import Step1Receive from "./Step1Receive";


interface StepItem {
    title: string;
}

const steps: StepItem[] = [
    {title: "基础信息"},
    {title: "合同信息"},
    {title: "费用明细"},
    {title: "确认提交"},
];

const B223Create: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const navigate = useNavigate();

        // 👇 先定义空 state 和方法，避免 TS 报错
    const [scannedFiles, setScannedFiles] = useState<any[]>([]);

    const next = async () => {
        try {
            await form.validateFields();
            setCurrentStep((prev) => prev + 1);
        } catch (err) {
            console.log("验证失败:", err);
        }
    };

    const prev = () => setCurrentStep((prev) => prev - 1);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            console.log("提交数据:", values);
            message.success("提交成功！");
            navigate("/workbench/b223");
        } catch (err) {
            console.log("提交失败:", err);
        }
    };

    return (
        <Card>
            {/* 步骤导航：直接用 items 属性 */}
            <Steps
                current={currentStep}
                style={{marginBottom: 24}}
                items={steps.map((item) => ({key: item.title, title: item.title}))}
            />

            <Form form={form} layout="vertical"
                  initialValues={{projectName: "", contractName: "", sendAmount: 0, auditAmount: 0}}>

                {currentStep === 0 && (
                    <Step1Receive value={scannedFiles} onChange={setScannedFiles}/>
                )}


                {currentStep === 1 && (
                    <>
                        <Form.Item
                            label="合同名称"
                            name="contractName"
                            rules={[{required: true, message: "请输入合同名称"}]}
                        >
                            <Input placeholder="请输入合同名称"/>
                        </Form.Item>

                        <Form.Item
                            label="建设单位"
                            name="constructionUnit"
                            rules={[{required: true, message: "请输入建设单位"}]}
                        >
                            <Input placeholder="请输入建设单位"/>
                        </Form.Item>

                        <Form.Item
                            label="施工单位"
                            name="contractor"
                            rules={[{required: true, message: "请输入施工单位"}]}
                        >
                            <Input placeholder="请输入施工单位"/>
                        </Form.Item>
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        <Form.Item
                            label="送审金额"
                            name="sendAmount"
                            rules={[{required: true, message: "请输入送审金额"}]}
                        >
                            <Input type="number" placeholder="请输入送审金额"/>
                        </Form.Item>

                        <Form.Item
                            label="审定金额"
                            name="auditAmount"
                            rules={[{required: true, message: "请输入审定金额"}]}
                        >
                            <Input type="number" placeholder="请输入审定金额"/>
                        </Form.Item>
                    </>
                )}

                {currentStep === 3 && (
                    <div>
                        <p>请确认以下信息无误后提交：</p>
                        <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
                    </div>
                )}
            </Form>

            {/* 按钮 */}
            <div style={{marginTop: 24}}>
                <Space>
                    {currentStep > 0 && <Button onClick={prev}>上一步</Button>}
                    {currentStep < steps.length - 1 && <Button type="primary" onClick={next}>下一步</Button>}
                    {currentStep === steps.length - 1 && <Button type="primary" onClick={handleSubmit}>提交</Button>}
                </Space>
            </div>
        </Card>
    );
};

export default B223Create;
