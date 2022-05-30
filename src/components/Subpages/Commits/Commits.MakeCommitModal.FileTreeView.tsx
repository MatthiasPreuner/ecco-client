import React, { Dispatch, SetStateAction } from 'react';
import { Node } from 'react-checkbox-tree';
import CheckboxTree from 'react-checkbox-tree';

import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { FileWithPath } from 'react-dropzone';

interface IProps {
    files?: Map<String, FileWithPath>, //FileWithPath[],
    //setChoosenFiles?: Dispatch<SetStateAction<FileWithPath[]>>
    onChange?: (choosenFiles: FileWithPath[]) => void
}

interface IState {
    checked: any[];
    expanded: any[];
    nodes: any,
    prevFiles: Map<String, FileWithPath>
}

// see https://icons.getbootstrap.com/
const availableBootstrapIconsFileTypes = ["aac", "ai", "bmp", "cs", "css", "csv", "doc", "docx", "exe", "gif", "heic", "html", "java", "jpg", "js", "json", "jsx", "key", "m4p", "md", "mdx", "mov", "mp3", "mp4", "otf", "pdf", "php", "png", "ppt", "pptx", "psd", "py", "raw", "rb", "sass", "scss", "sh", "svg", "tiff", "tsx", "ttf", "txt", "wav", "woff", "xls", "xlsx", "xml", "yml"]

let root: Node[] = [{
    value: (-1).toString(),
    label: 'Root Folder',
    children: [],
}];

let folderIndex: number;

/* 
 * source:
 * https://www.npmjs.com/package/react-checkbox-tree
 */
export class FileTreeView extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            checked: [],
            expanded: [],
            nodes: root,
            prevFiles: props.files
        };
    }

    static createTree(files: FileWithPath[]): [any, string[]] {

        folderIndex = -1; // for unique folder values
        let root: Node[] = [{
            value: (folderIndex--).toString(),
            label: 'Root Folder',
            children: [],
        }];

        let tmpChecked: string[] = [];

        if (files === null || files.length < 1) return [root, []];

        files.forEach((f, idx) => {
            let path = f.path.substring(1) // remove starting '/'

            root[0].label = path.substring(0, path.indexOf('/')) // set root label (only needed once)

            path = path.substring(path.indexOf('/') + 1) // remove root folder
            FileTreeView.addPathToNode(root[0], f.name, idx, path, tmpChecked)
        })
        FileTreeView.sortRecursiveley(root[0]);
        return [root, tmpChecked];
    }

    static addPathToNode(node: Node, fileName: string, idx: number, path: string, tmpChecked: string[]) {
        let i = path.indexOf('/');
        if (i == -1) {
            FileTreeView.addFileToNode(node, fileName, idx, tmpChecked)
        } else {
            let folderName: string = path.substring(0, i)
            let childNode: Node = node.children.find(node => node.label === folderName) // check child-node exists

            if (!childNode) {
                childNode = {
                    value: (folderIndex--).toString(),
                    label: folderName,
                    children: []
                }
                node.children.push(childNode)
            }
            FileTreeView.addPathToNode(childNode, fileName, idx, path.substring(i + 1), tmpChecked)
        }
    }

    static addFileToNode(node: Node, fileName: string, idx: number, tmpChecked: string[]) {
        node.children.push({
            value: idx.toString(),
            label: fileName,
            icon: this.getFileIcon(fileName)
        })
        tmpChecked.push(idx.toString()) // ugly */
    }

    static getFileIcon(fileName: string): React.ReactNode {
        let extension: string = fileName.substring(fileName.lastIndexOf('.') + 1)

        if (availableBootstrapIconsFileTypes.includes(extension)) {
            return <i className={"bi bi-filetype-" + extension} />
        }
        return <i className="bi bi-file-earmark" />
    }

    static sortRecursiveley(node: Node) {
        node.children.sort((a, b) => {
            if (a.children !== undefined && b.children === undefined) {
                FileTreeView.sortRecursiveley(a);
                return -1;
            }
            if (b.children !== undefined && a.children === undefined) {
                FileTreeView.sortRecursiveley(b);
                return 1;
            }
            return a.label.toString().localeCompare(b.label.toString())
        })
    }

    onCheck(checked: string[]) {
        if (this.props.onChange) {
            // invoke onChange event
            let files: FileWithPath[] = [];
            checked.forEach(idx => { files.push(this.state.prevFiles.get(idx)) })
            this.props.onChange.call(this, files);
        }
        this.setState({ checked });
    }

    static getDerivedStateFromProps(nextProps: IProps, prevState: any) {
        if (nextProps.files !== prevState.prevFiles) {
            let [allNodes, checkedNodes] = FileTreeView.createTree(Array.from(nextProps.files.values()));
            return ({ ...prevState, nodes: allNodes, checked: checkedNodes, prevFiles: nextProps.files })
        }
        return null;
    }

    render() {
        if (this.props.files?.size > 0) {
            return (
                <CheckboxTree
                    nodes={this.state.nodes}
                    checked={this.state.checked}
                    expanded={this.state.expanded}
                    onCheck={checked => this.onCheck(checked)}
                    onExpand={expanded => this.setState({ expanded })}
                    icons={{
                        check: <i className="bi bi-check-square-fill" />,
                        uncheck: <i className="bi bi-square" />,
                        halfCheck: <i className="bi bi-check-square" />,
                        expandClose: <i className="bi bi-caret-right-fill" />,
                        expandOpen: <i className="bi bi-caret-down-fill" />,
                        expandAll: <i className="bi bi-plus-square" />,
                        collapseAll: <i className="bi bi-dash-square" />,
                        parentClose: <i className="bi bi-folder" />,
                        parentOpen: <i className="bi bi-folder2-open" />,
                        leaf: <i className="bi bi-file-earmark" />,
                    }}
                    showExpandAll
                />
            );
        } else {
            return <></>
        }
    }
}