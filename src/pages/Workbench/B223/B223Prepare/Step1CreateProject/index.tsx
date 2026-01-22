import React, {useEffect} from "react";
import {Form, Input, Select} from "antd";

const {Option} = Select;

/** ✅ 模拟项目数据（后期你可以换成接口） */
const mockProjects = [
    {id: "XM202428468", name: "中缅管道45#阀室—昌明—贵定—福泉支线管道工程（昌明—福泉段）项目决算审计"},
    {id: "XM202427822", name: "中煤陕西能源化工集团有限公司 2024~2026 年零星外委作业结算复审"},
    {id: "XM202427788", name: "精细化工及原料工程项目标段3工程造价咨询服务"},
];

const Step1CreateProject: React.FC = () => {
    const [form] = Form.useForm();

    /** 选择关联项目后，自动带出工程名称 */
    const handleProjectChange = (projectId: string) => {
        const project = mockProjects.find(p => p.id === projectId);
        if (project) {
            form.setFieldsValue({
                relatedProjectId: project.id,
                projectName: project.name,
            });
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                relatedProjectId: undefined,
                projectName: "",
                auditType: "竣工结算审核",
            }}
        >
            {/* ✅ 1. 关联造价项目（最重要，放最上面） */}
            <Form.Item
                label="关联造价咨询合同 / 审核委托书"
                name="relatedProjectId"
                rules={[{required: true, message: "请选择一个关联项目"}]}
            >
                <Select
                    placeholder="请选择一个已存在的造价 / 审计项目"
                    onChange={handleProjectChange}
                    showSearch
                    optionFilterProp="children"
                >
                    {mockProjects.map(p => (
                        <Option key={p.id} value={p.id}>
                            {p.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            {/* 2. 工程名称（可自动带出，可改，可空） */}
            <Form.Item label="工程名称" name="projectName">
                <Input placeholder="可暂不填写，后续从送审资料中自动识别"/>
            </Form.Item>

            {/* 3. 审核类型（固定） */}
            <Form.Item label="审核类型" name="auditType">
                <Select disabled>
                    <Option value="竣工结算审核">竣工结算审核</Option>
                </Select>
            </Form.Item>


            {/* 4. 项目组成员（预留） */}
            <Form.Item label="项目组成员（预留）">
                <Input.TextArea
                    disabled
                    rows={3}
                    placeholder="此处后续对接人员系统，当前版本不支持配置"
                />
            </Form.Item>
        </Form>
    );
};

export default Step1CreateProject;