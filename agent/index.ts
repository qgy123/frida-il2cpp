let Il2cppApi: any = {
    il2cpp_domain_get: ['pointer', []],
    il2cpp_domain_get_assemblies: ['pointer', ['pointer', 'uint']],
    il2cpp_thread_current: ['pointer', []],
    il2cpp_thread_attach: ['pointer', ['pointer']],
    il2cpp_thread_detach: ['void', ['pointer']],
    il2cpp_assembly_get_image: ['pointer', ['pointer']],
    il2cpp_image_get_assembly: ['pointer', ['pointer']],
    il2cpp_image_get_name: ['pointer', ['pointer']], //char, char*?
    il2cpp_image_get_filename: ['pointer', ['pointer']],
    il2cpp_image_get_class_count: ['uint', ['pointer']],
    il2cpp_image_get_class: ['pointer', ['pointer', 'uint']],
    il2cpp_class_get_name: ['pointer', ['pointer']],
    il2cpp_class_get_namespace: ['pointer', ['pointer']],
    il2cpp_class_from_name: ['pointer', ['pointer', 'pointer', 'pointer']],
    il2cpp_class_get_method_from_name: ['pointer', ['pointer', 'pointer', 'int']],
    il2cpp_method_get_name: ['pointer', ['pointer']],
    il2cpp_method_get_class: ['pointer', ['pointer']]
}

for (const key in Il2cppApi) {
    if (Il2cppApi.hasOwnProperty(key)) {
        const exp_name = Il2cppApi[key];
        const addr = Module.findExportByName(null, exp_name);
        Il2cppApi[key] = !addr
            ? () => { throw new Error('Export not found: ' + exp_name) }
            : Il2cppApi[key] = new NativeFunction(addr, Il2cppApi[key][0], Il2cppApi[key][1], "mscdecl");
    }
}

let Il2CppThread_Ptr = Il2cppApi.il2cpp_thread_attach(Il2cppApi.il2cpp_domain_get());