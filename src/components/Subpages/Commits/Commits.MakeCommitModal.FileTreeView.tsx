import * as React from "react";
import { forwardRef, useImperativeHandle } from 'react';
import { FileWithPath } from 'react-dropzone'
import { useState, useEffect } from "react";

/* import React, { Dispatch, SetStateAction } from 'react'; */
import { Node } from 'react-checkbox-tree';
import CheckboxTree from 'react-checkbox-tree';

import 'react-checkbox-tree/lib/react-checkbox-tree.css';


interface IProps {
    files?: Map<String, FileWithPath>,
    //setChoosenFiles?: Dispatch<SetStateAction<FileWithPath[]>>
    onChange?: (choosenFiles: FileWithPath[]) => void,
    ref: React.Ref<FileTreeViewRef>
}

export interface FileTreeViewRef {
    expandAll(): void;
    collapseAll(): void;
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

/* React.forwardRef<RefType, PropsType>((props, ref) */
export const FileTreeView: React.FC<IProps> = forwardRef<FileTreeViewRef, IProps>((props, ref) => {

    const [checked, setChecked] = useState<string[]>([]);
    const [expanded, setExpanded] = useState<string[]>([]);
    const [nodes, setNodes] = useState<Node[]>(root);
    const [arrExpandAll, setArrExpandAll] = useState<string[]>([]);

    const createTree = (files: FileWithPath[]): [any, string[]] => {

        let tmpExpandAll : string [] = [];

        folderIndex = -1; // for unique folder values
        tmpExpandAll.push(folderIndex.toString())
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
            addPathToNode(root[0], f.name, idx, path, tmpChecked, tmpExpandAll)
        })
        sortRecursiveley(root[0]);
        setArrExpandAll(tmpExpandAll);
        return [root, tmpChecked];
    }

    const addPathToNode = (node: Node, fileName: string, idx: number, path: string, tmpChecked: string[], tmpExpandAll: string[]) => {
        let i = path.indexOf('/');
        if (i === -1) {
            addFileToNode(node, fileName, idx, tmpChecked)
        } else {
            let folderName: string = path.substring(0, i)
            let childNode: Node = node.children.find(node => node.label === folderName) // check child-node exists

            if (!childNode) {
                tmpExpandAll.push(folderIndex.toString())
                childNode = {
                    value: (folderIndex--).toString(),
                    label: folderName,
                    children: []
                }
                node.children.push(childNode)
            }
            addPathToNode(childNode, fileName, idx, path.substring(i + 1), tmpChecked, tmpExpandAll)
        }
    }

    const addFileToNode = (node: Node, fileName: string, idx: number, tmpChecked: string[]) => {
        node.children.push({
            value: idx.toString(),
            label: fileName,
            icon: getFileIcon(fileName)
        })
        tmpChecked.push(idx.toString()) // ugly
    }

    const getFileIcon = (fileName: string): React.ReactNode => {
        let extension: string = fileName.substring(fileName.lastIndexOf('.') + 1)

        if (availableBootstrapIconsFileTypes.includes(extension)) {
            return <i className={"bi bi-filetype-" + extension} />
        }
        return <i className="bi bi-file-earmark" />
    }

    const sortRecursiveley = (node: Node) => {
        node.children.sort((a, b) => {
            if (a.children !== undefined && b.children === undefined) {
                sortRecursiveley(a);
                return -1;
            }
            if (b.children !== undefined && a.children === undefined) {
                sortRecursiveley(b);
                return 1;
            }
            return a.label.toString().localeCompare(b.label.toString())
        })
    }

    useEffect(() => {
        let [allNodes, checkedNodes] = createTree(Array.from(props.files.values()));
        setChecked(checkedNodes)
        setNodes(allNodes)
    }, [props.files]);

    useEffect(() => {

        if (props.onChange) {
            let files: FileWithPath[] = [];
            Array.from(props.files.values()).forEach((f, idx) => {
                if (checked.includes(idx.toString())) {
                    files.push(f);
                }
            })
            props.onChange.call(this, files);
        }
    }, [checked]);


    useImperativeHandle(ref, () => ({
        expandAll() { setExpanded(arrExpandAll) },
        collapseAll() { setExpanded([]) },
    }));

    if (props.files?.size > 0) {
        return (
            <CheckboxTree
                nodes={nodes}
                checked={checked}
                expanded={expanded}
                onCheck={checked => setChecked(checked)}
                onExpand={expanded => setExpanded(expanded)}
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

});